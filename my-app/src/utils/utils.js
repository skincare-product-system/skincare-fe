/* eslint-disable no-console */
import axios, { HttpStatusCode } from 'axios'

export const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num)
}
export function isAxiosError(error) {
  return axios.isAxiosError(error)
}

// lỗi 422
export function isAxiosUnprocessableEntity(error) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
// lỗi 401
export function isAxiosUnauthorizedError(error) {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError(error) {
  return isAxiosUnauthorizedError && error.response?.data?.message === 'Jwt expired'
}
