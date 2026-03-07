import { createContext, useContext, useState, useEffect } from 'react'
import { silentLogin, getStoredToken, getDeviceId } from '../services/auth'

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(getStoredToken())
  const [isOnline, setIsOnline] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authenticate = async () => {
      const result = await silentLogin()
      if (result.success) {
        setUser(result.user)
        setToken(result.token)
        setIsOnline(true)
      } else {
        setUser({ id: getDeviceId(), username: 'Explorer', isOffline: true })
        setIsOnline(false)
      }
      setIsLoading(false)
    }
    authenticate()
  }, [])

  const value = {
    user,
    token,
    isOnline,
    isLoading,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

