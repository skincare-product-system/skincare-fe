import shipApi from '../apis/ship.api'

export const getProvinceName = async (provinceId) => {
  try {
    const response = await shipApi.getProvinces()
    const province = response.data.find((p) => p.ProvinceID == provinceId)
    return province ? province.ProvinceName : 'Không xác định'
  } catch (error) {
    console.error('Lỗi lấy tên tỉnh:', error)
    return 'Không xác định'
  }
}

export const getDistrictName = async (province_code, districtId) => {
  try {
    const response = await shipApi.getDistricts(province_code)
    const district = response.data.find((d) => d.DistrictID == districtId)
    return district ? district.DistrictName : 'Không xác định'
  } catch (error) {
    console.error('Lỗi lấy tên quận:', error)
    return 'Không xác định'
  }
}

export const getWardName = async (district_code, wardCode) => {
  try {
    const response = await shipApi.getWards(district_code)
    const ward = response.data.find((w) => w.WardCode == wardCode)
    return ward ? ward.WardName : 'Không xác định'
  } catch (error) {
    console.error('Lỗi lấy tên phường:', error)
    return 'Không xác định'
  }
}
