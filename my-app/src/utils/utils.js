import axios, { HttpStatusCode } from 'axios'

export const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num)
}
export function isAxiosError(error) {
  return axios.isAxiosError(error)
}
export function isAxiosUnprocessableEntity(error) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
