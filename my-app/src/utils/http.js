/* eslint-disable no-console */
import axios, { HttpStatusCode } from 'axios'
import Toast from 'react-native-toast-message'

import { refreshTokenUrl } from '../apis/auth.api'

import {
  clearAsyncStorage,
  getAccessTokenFromAsyncStorage,
  getRefreshTokenFromAsyncStorage,
  setAccessTokenToAsyncStorage,
  setProfileToAsyncStorage,
  setRefreshTokenToAsyncStorage
} from './auth'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'

class Http {
  instance
  accessToken = ''
  refreshToken = ''
  refreshTokenRequest = null

  constructor() {
    this.instance = axios.create({
      baseURL: `https://7f8d-2402-800-63a9-fa3f-d0f1-25e-3770-5713.ngrok-free.app`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      async (config) => {
        if (this.accessToken) {
          config.headers.authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        console.log('lũi ne', error)
        Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      async (response) => {
        const { url } = response.config
        console.log('data', response.data.result)

        if (url.includes('login') || url.includes('register')) {
          const { access_token, refresh_token } = response.data.result
          setAccessTokenToAsyncStorage(access_token)
          setRefreshTokenToAsyncStorage(refresh_token)
          setProfileToAsyncStorage(response.data.result.user)

          this.accessToken = access_token
          this.refreshToken = refresh_token
        } else if (url.includes('logout')) {
          console.log(123)

          this.accessToken = ''
          this.refreshToken = ''
          await clearAsyncStorage()
        }
        return response
      },
      async (error) => {
        if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status)) {
          const data = error.response?.data
          const message = data.message || error.message

          console.log('lỗi khác 422 và 401', error.response?.status, message)

          Toast.show({
            type: 'error',
            text1: message
          })
        }

        if (isAxiosUnauthorizedError(error)) {
          const config = error.response?.config || { headers: {}, url: '' }
          const { url } = config
          console.log('lỗi 401', url)

          if (isAxiosExpiredTokenError(error) && url !== refreshTokenUrl) {
            console.log('expired token')
            console.log('refreshTokenRequest', this.refreshTokenRequest)

            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })

            return this.refreshTokenRequest.then((access_token) => {
              return this.instance({
                ...config,
                headers: { ...config.headers, authorization: `Bearer ${access_token}` }
              })
            })
          }

          console.log('lỗi 401 do k truyền token hoặc token invalid')

          Toast.show({
            type: 'error',
            text1: error.response?.data.message
          })
          await clearAsyncStorage()
          this.accessToken = ''
          this.refreshToken = ''
        }

        return Promise.reject(error)
      }
    )
  }

  async init() {
    this.accessToken = await getAccessTokenFromAsyncStorage()
    this.refreshToken = await getRefreshTokenFromAsyncStorage()
  }

  handleRefreshToken() {
    return this.instance
      .post(refreshTokenUrl, { refresh_token: this.refreshToken })
      .then(async (response) => {
        this.accessToken = response.data.result.access_token
        this.refreshToken = response.data.result.refresh_token

        await setAccessTokenToAsyncStorage(this.accessToken)
        await setRefreshTokenToAsyncStorage(this.refreshToken)

        return this.accessToken
      })
      .catch(async (error) => {
        await clearAsyncStorage()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http()
http.init()
export default http.instance
