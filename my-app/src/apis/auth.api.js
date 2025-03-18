/* eslint-disable no-console */
import { getRefreshTokenFromAsyncStorage } from '../utils/auth'
import http from '../utils/http'

const userUrl = '/api/users'
export const refreshTokenUrl = '/api/users/refresh-token'
const authApi = {
  async login(email, password) {
    return await http.post(`${userUrl}/login`, { email, password })
  },
  async register(email, password, username, phone) {
    return await http.post(`${userUrl}/register`, { email, password, username, phone })
  },
  async getMe() {
    return await http.get(`${userUrl}/me`)
  },
  async updateMe(payload) {
    return await http.patch(`${userUrl}/me`, {
      ...payload
    })
  },
  async logout() {
    const refresh_token = await getRefreshTokenFromAsyncStorage()
    return await http.post(`${userUrl}/logout`, {
      refresh_token
    })
  }
}
export default authApi
