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
import { set } from 'react-hook-form'

class Http {
  instance
  accessToken
  refreshToken
  refreshTokenRequest
  constructor() {
    this.accessToken = getAccessTokenFromAsyncStorage()
    this.refreshToken = getRefreshTokenFromAsyncStorage()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      // baseURL: `https://skincare-be-mma.onrender.com`,
      baseURL: `https://8e61-2402-800-62a9-8760-f01d-c213-ff9f-b101.ngrok-free.app`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      async (config) => {
        // const token = await getAccessTokenFromAsyncStorage()
        // console.log('token: ', token)

        if (this.accessToken) {
          config.headers.authorization = `Bearer ${this.accessToken}`
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      async (response) => {
        const { url } = response.config

        if (url.includes('login') || url.includes('register')) {
          const { access_token, refresh_token } = response.data.result

          setAccessTokenToAsyncStorage(access_token)
          setRefreshTokenToAsyncStorage(refresh_token)
          setProfileToAsyncStorage(response.data.result.user)

          this.accessToken = access_token

          this.refreshToken = refresh_token
        } else if (url.includes('logout')) {
          this.accessToken = ''
          this.refreshToken = ''
          console.log(this.accessToken, this.refreshToken)

          clearAsyncStorage()
        }
        return response
      },
      (error) => {
        // chỉ toast lỗi !== 422 (UnprocessableEntity) và !== 401 (Unauthorized)
        if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status)) {
          const data = error.response?.data
          const message = data.message || error.message
          console.log('message', data.message)

          Toast.show({
            type: 'error',
            text1: message
          })
        }
        // looic 401 có nhiều TH
        // 1. token hết hạn
        // 2. không truyền token
        // 3. token không có quyền truy cập
        if (isAxiosUnauthorizedError(error)) {
          console.log('lỗi 401')
          // 1. token hết hạn & refresh token kp của RefreshTokenRequest
          // tiến hành gọi refresh token
          const config = error.response?.config || { headers: {}, url: '' }
          const { url } = config
          console.log('url', url)

          if (isAxiosExpiredTokenError(error) && url !== refreshTokenUrl) {
            console.log('lỗi 401 token hết hạn gọi lại rftk')

            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // xóa request sau 10s
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              // gọi lại request cũ
              return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
            })
          }
          // TH 2 & 3
          // toast lỗi
          //  toast.error(error.response?.data.data?.message || error.response?.data.message)
          console.log('token không có quyền truy cập hoặc không truyền token')

          Toast.show({
            type: 'error',
            text1: error.response?.data.message
          })
          clearAsyncStorage()
          this.accessToken = ''
          this.refreshToken = ''
        }
        return Promise.reject(error)
      }
    )
  }
  async handleRefreshToken() {
    return this.instance
      .post(refreshTokenUrl, { refresh_token: this.refreshToken })
      .then(async (response) => {
        this.accessToken = response.data.result.access_token
        await setAccessTokenToAsyncStorage(this.accessToken)
        this.refreshToken = response.data.result.refresh_token
        await setRefreshTokenToAsyncStorage(this.refreshToken)
        return this.accessToken
      })
      .catch((error) => {
        clearAsyncStorage()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}
const http = new Http().instance
export default http
