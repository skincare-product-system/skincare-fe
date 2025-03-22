import http from '../utils/http'

const wishListUrl = '/api/wishList'
const wishListApi = {
  async addToWishList(product_id, variation_id) {
    return await http.post(`${wishListUrl}/add`, { product_id, variation_id })
  },
  async deleteFromWishList(product_id, variation_id) {
    return await http.delete(`${wishListUrl}/delete`, {
      data: { product_id, variation_id }
    })
  },
  async getWishList() {
    return await http.get(`${wishListUrl}/all`)
  }
}
export default wishListApi
