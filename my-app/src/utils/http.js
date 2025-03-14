/* eslint-disable no-console */
import axios from 'axios'

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
      (config) => {
        if (this.accessToken) {
          config.headers.authorization = this.accessToken
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use((response) => {
      const { url } = response.config
      if (url.includes('login') || url.includes('register')) {
        this.accessToken = response.data.result.access_token
        this.refreshToken = response.data.result.refresh_token
        setAccessTokenToAsyncStorage(this.accessToken)
        setRefreshTokenToAsyncStorage(this.refreshToken)
        setProfileToAsyncStorage(response.data.result.user)
      } else if (url.includes('logout')) {
        this.accessToken = ''
        this.refreshToken = ''
        clearAsyncStorage()
      }
      return response
    })
  }
}
const http = new Http().instance
export default http
