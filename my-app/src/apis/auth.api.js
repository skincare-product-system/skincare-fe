import http from '../utils/http'

const userUrl = '/api/users'
const authApi = {
  async login(email, password) {
    return await http.post(`${userUrl}/login`, { email, password })
  },
  async register(email, password, username, phone) {
    return await http.post(`${userUrl}/register`, { email, password, username, phone })
  }
}
export default authApi
