import { v4 as uuidv4 } from 'uuid'
import api from './api'

const DEVICE_ID_KEY = 'focusflow-device-id'
const TOKEN_KEY = 'focusflow-token'

export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = uuidv4()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}

export const silentLogin = async () => {
  const deviceId = getDeviceId()

  try {
    const response = await api.post('/auth/silent', { device_id: deviceId })
    const { token, user } = response.data
    localStorage.setItem(TOKEN_KEY, token)
    return { success: true, user, token }
  } catch (error) {
    console.warn('Silent login failed, running in offline mode:', error.message)
    return { success: false, user: null, token: null }
  }
}

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY)
}