import http from '../utils/http'

const addressUrl = '/api/address'

const addressApi = {
  async getAddresses() {
    return await http.get(`${addressUrl}`)
  },
  async addAddress(payload) {
    return await http.post(`${addressUrl}/add`, {
      phone_number: payload.phone_number,
      ward_code: payload.ward_code,
      district_code: payload.district_code,
      province_code: payload.province_code,
      receiver_name: payload.receiver_name,
      address: payload.address,
      is_default: payload.is_default
    })
  },
  async deleteAddress(address_id) {
    return await http.delete(`${addressUrl}/delete/${address_id}`)
  },
  async updateAddress(payload) {
    return await http.patch(`${addressUrl}/${payload.address_id}`, {
      phone_number: payload.phone_number,
      ward_code: payload.ward_code,
      district_code: payload.district_code,
      province_code: payload.province_code,
      receiver_name: payload.receiver_name,
      address: payload.address,
      is_default: payload.is_default
    })
  }
}
export default addressApi
