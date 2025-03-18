/* eslint-disable no-console */
import axios from 'axios'

import { refreshTokenUrl } from '../apis/auth.api'

import {
  clearAsyncStorage,
  getAccessTokenFromAsyncStorage,
  getRefreshTokenFromAsyncStorage,
  setAccessTokenToAsyncStorage,
  setProfileToAsyncStorage,
  setRefreshTokenToAsyncStorage
} from './auth'

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
      baseURL: `https://skincare-be-mma.onrender.com`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await getAccessTokenFromAsyncStorage()

        if (this.accessToken) {
          config.headers.authorization = `Bearer ${token.replace(/"/g, '')}`
        }
        console.log('config', config.headers)

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(async (response) => {
      const { url } = response.config

      if (url.includes('login') || url.includes('register')) {
        const { access_token, refresh_token } = response.data.result
        console.log('access_token ', access_token)

        setAccessTokenToAsyncStorage(access_token)
        setRefreshTokenToAsyncStorage(refresh_token)
        setProfileToAsyncStorage(response.data.result.user)

        this.accessToken = access_token

        this.refreshToken = refresh_token
      } else if (url.includes('logout')) {
        this.accessToken = ''
        this.refreshToken = ''
        clearAsyncStorage()
      }
      return response
    })
  }
  async handleRefreshToken() {
    return this.instance
      .post(refreshTokenUrl, { refresh_token: this.refreshToken })
      .then((response) => {
        console.log('response', response.data.result)

        this.accessToken = response.data.result.access_token
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
