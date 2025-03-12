import http from '../utils/http'

const categoryUrl = '/api/categories'
const categoryApi = {
  async getCategories() {
    return await http.get(`${categoryUrl}/all`)
  }
}
export default categoryApi
