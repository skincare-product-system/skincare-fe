import http from '../utils/http'

const orderUrl = '/api/orders'
const orderApi = {
  async getOrder(orderId) {
    return await http.get(`${orderUrl}/${orderId}`)
  },
  async getOrdersByStatus(status) {
    return await http.get(`${orderUrl}?status=${status}`)
  }
}
export default orderApi
