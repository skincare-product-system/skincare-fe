import { createContext, useContext, useEffect, useState } from 'react'

import { getAccessTokenFromAsyncStorage, getProfileFromAsyncStorage } from '../utils/auth'

const initialAppContext = {
  isAuthenticated: Boolean(getAccessTokenFromAsyncStorage()),
  setIsAuthenticated: () => null,
  profile: null,
  setProfile: () => null,
  reset: () => null
}

export const AuthenContext = createContext(initialAppContext)
export const useAuth = () => {
  return useContext(AuthenContext)
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState(initialAppContext.profile)
  useEffect(() => {
    const loadAuthData = async () => {
      const accessToken = await getAccessTokenFromAsyncStorage()
      const userProfile = await getProfileFromAsyncStorage()

      setIsAuthenticated(Boolean(accessToken))
      setProfile(userProfile)
    }

    loadAuthData()
  }, [])
  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }

  return (
    <AuthenContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, reset }}>
      {children}
    </AuthenContext.Provider>
  )
}
