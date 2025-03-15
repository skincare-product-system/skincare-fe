import http from '../utils/http'

const supportUrl = '/api/support'
const supportApi = {
  async sendSupportRequest(data) {
    return await http.post(supportUrl, data)
  }
}

export default supportApi
