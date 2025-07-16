import axios from 'axios'
import { setLastActivity } from '../Trackers/activityTracker'

let url
if (process.env.REACT_APP_RUNNING_ENV === 'prod') {
  url = 'https://mapper.gobosoft.fi'
} else if (process.env.REACT_APP_RUNNING_ENV === 'qa') {
  url = 'https://gobomapperdemo.swedencentral.cloudapp.azure.com'
} else if (process.env.REACT_APP_IS_TESTING === 'true') {
  url = 'http://backend:8000'
} else {
  url = 'http://localhost:8000'
}

const baseUrl = `${url}/api/auth/token/refresh`
const tokenUrl = `${url}/api/auth/logout/automatic`

const logout = async () => {
  try {
    await axios.post(tokenUrl, {}, { withCredentials: true })
    console.log('Logged out successfully')
  } catch (error) {
    console.error('Failed to automatically log out:', error)
  }
  updateLocalStorage()
}

const refreshToken = async () => {
  console.log('Starting token refresh')
  try {
    const response = await axios.post(baseUrl, {}, { withCredentials: true })
    console.log('Response from token refresh:', response)
    if (response && response.data) {
      console.log('Token refresh successful')
      setLastActivity()
      return response.data
    } else {
      console.log('Invalid response from token refresh')
      throw new Error('Invalid response from token refresh')
    }
  } catch (error) {
    console.log('Token refresh failed:', error)
    throw error
  }
}

const updateLocalStorage = () => {
  console.log('Updating local storage: setting isLoggedIn to false')
  localStorage.setItem('isLoggedIn', 'false')
}

export { refreshToken, logout, updateLocalStorage }
