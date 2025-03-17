import http from '../utils/http'

const userUrl = '/api/users'
export const refreshTokenUrl = '/api/auth/refresh-token'
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
  }
}
export default authApi
