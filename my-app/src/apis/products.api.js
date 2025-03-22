import http from '../utils/http'

const productUrl = '/api/products'
const productApi = {
  async getProductsByCategoryId(categoryId) {
    return await http.get(`${productUrl}?category_id=${categoryId}`)
  },
  async getProductDetail(productId) {
    return await http.get(`${productUrl}/${productId}`)
  },
  async getProductsByVariationId(variationId) {
    return await http.get(`${productUrl}?variation_id=${variationId}`)
  },
  async getProductsByBrandId(brandId) {
    return await http.get(`${productUrl}?brand_id=${brandId}`)
  }
}
export default productApi
