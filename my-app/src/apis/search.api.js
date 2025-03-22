import http from '../utils/http'

const searchUrl = '/api/search'
const searchApi = {
  async search(keyword) {
    return await http.get(`${searchUrl}?content=${keyword}`)
  }
}
export default searchApi
