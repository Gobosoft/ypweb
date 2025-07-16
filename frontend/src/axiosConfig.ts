import axios from 'axios'
import { refreshToken, logout } from './services/Auth/token'
import {
  getLastActivity,
  setLastActivity,
} from './services/Trackers/activityTracker'
import { getHandleLogoutFunction } from './services/Auth/authUtils'
import { THIRTY_MINUTES } from './constants'

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

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
})

let isRefreshing = false
let failedRefresh = false

axiosInstance.interceptors.request.use(
  async (config) => {
    const lastActivity = getLastActivity()
    const currentTime = Date.now()
    const timeDifference = lastActivity ? currentTime - lastActivity : 0

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (isLoggedIn && lastActivity && timeDifference > THIRTY_MINUTES) {
      console.log(`Request to ${config.url} - User is inactive, logging out...`)
      const handleLogout = getHandleLogoutFunction()
      if (handleLogout) {
        await handleLogout()
        console.log('User logged out due to inactivity')
      }
      throw new axios.Cancel('Logged out due to inactivity')
    }

    if (isLoggedIn) {
      setLastActivity()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    setLastActivity()
    return response
  },
  async (error) => {
    const { config, response } = error
    const originalRequest = config

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (response && response.status === 401 && isLoggedIn && !failedRefresh) {
      if (!originalRequest._retry) {
        originalRequest._retry = true
        if (isRefreshing) {
          return new Promise((resolve) => {
            const intervalId = setInterval(() => {
              if (!isRefreshing) {
                clearInterval(intervalId)
                resolve(axiosInstance(originalRequest))
              }
            }, 200)
          })
        }

        isRefreshing = true
        console.log('Starting token refresh process')
        try {
          await refreshToken()
          isRefreshing = false
          setLastActivity()
          console.log('Token refresh successful, retrying original request')
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          console.log(
            `Request to ${originalRequest.url} - Token refresh failed:`,
            refreshError
          )
          isRefreshing = false
          failedRefresh = true
          const handleLogout = getHandleLogoutFunction()
          console.log('Attempting to handle logout due to refresh failure')
          if (handleLogout) {
            await handleLogout()
            console.log('User logged out due to failed token refresh')
          } else {
            console.error('handleLogout function not available')
          }
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
