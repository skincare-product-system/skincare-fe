import http from '../utils/http'

const productUrl = '/products'
const productApi = {
  async getProducts(params) {
    return await http.get(productUrl, {
      params
    })
  },
  async getProductDetail(id) {
    return await http.get(`${productUrl}/${id}`)
  }
}
export default productApi
