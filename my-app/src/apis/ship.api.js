import http from '../utils/http'

const shipUrl = '/api/ship'
const shipApi = {
  async getProvinces() {
    return await http.get(`${shipUrl}/provinces`)
  },
  async getDistricts(provinceId) {
    return await http.post(`${shipUrl}/districts`, { province_id: provinceId })
  },
  async getWards(districtId) {
    return await http.post(`${shipUrl}/wards`, { district_id: districtId })
  }
}
export default shipApi
