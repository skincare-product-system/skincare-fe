/* eslint-disable no-console */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { EventTarget } from 'event-target-shim'
export const LocalStorageEventTarget = new EventTarget()

export const setAccessTokenToAsyncStorage = async (accessToken) => {
  await AsyncStorage.setItem('access_token', accessToken)
}
export const clearAsyncStorage = async () => {
  await AsyncStorage.removeItem('access_token')
  await AsyncStorage.removeItem('refresh_token')
  await AsyncStorage.removeItem('profile')

  const clearLocalStorageEventTarget = new Event('clearLocalStorage')
  LocalStorageEventTarget.dispatchEvent(clearLocalStorageEventTarget)
}
export const getAccessTokenFromAsyncStorage = async () => {
  return (await AsyncStorage.getItem('access_token')) || ''
}
export const getProfileFromAsyncStorage = async () => {
  const profile = await AsyncStorage.getItem('profile')
  return profile ? JSON.parse(profile) : null
}

export const setProfileToAsyncStorage = async (profile) => {
  await AsyncStorage.setItem('profile', JSON.stringify(profile))
}

export const setRefreshTokenToAsyncStorage = async (refreshToken) => {
  await AsyncStorage.setItem('refresh_token', refreshToken)
}
export const getRefreshTokenFromAsyncStorage = async () => {
  return (await AsyncStorage.getItem('refresh_token')) || ''
}
