import http from '../utils/http'

const brandUrl = '/api/brands'
const brandApi = {
  async getAllBrands() {
    return await http.get(`${brandUrl}/all`)
  }
}
export default brandApi
