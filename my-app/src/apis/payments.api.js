import http from '../utils/http'

const paymentUrl = '/api/payment/zalopay'
const paymentApi = {
  async createPayment(payload) {
    return await http.post(`${paymentUrl}`, {
      ...payload
    })
  }
}
export default paymentApi
