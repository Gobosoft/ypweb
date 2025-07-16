import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { logout as automaticLogout } from '../services/Auth/token'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { setHandleLogoutFunction } from '../services/Auth/authUtils'
import usersService from '../services/Users/users'
import { useAppContext } from './AppProvider'
import { THIRTY_MINUTES } from '../constants'
import { CurrentUserState } from '../lib/types'
import {
  getLastActivity,
  setLastActivity,
} from '../services/Trackers/activityTracker'

interface AuthContextProps {
  isLoggedIn: boolean
  languageIsSet: boolean
  handleLogin: () => void
  handleLogout: () => void
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn')
    return storedIsLoggedIn === 'true'
  })
  const [languageIsSet, setLanguageIsSet] = useState<boolean>(false)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { setCurrentUser } = useAppContext()

  const handleLogout = useCallback(async () => {
    setIsLoggedIn(false)
    setCurrentUser({} as CurrentUserState)
    if (localStorage.getItem('isLoggedIn') !== 'false') {
      localStorage.setItem('isLoggedIn', 'false')
      const lng = navigator.language
      i18n.changeLanguage(lng)
      await automaticLogout()
      navigate('/')
      toast.info(i18n.t('authMessages.logutDueInactivity'))
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Nessage shows 1.5 sec before reload
      window.location.reload() // Page reload needs to be forced to ensure proper session management later
    }
  }, [navigate, i18n])

  useEffect(() => {
    setHandleLogoutFunction(handleLogout)
  }, [handleLogout])

  useEffect(() => {
    const checkInitialActivity = async () => {
      const lastActivity = getLastActivity()
      const currentTime = Date.now()
      const timeDifference = lastActivity ? currentTime - lastActivity : 0

      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      if (isLoggedIn && lastActivity && timeDifference > THIRTY_MINUTES) {
        console.log('User was inactive, logging out...')
        setIsLoggedIn(false)
        localStorage.setItem('isLoggedIn', 'false')
        await automaticLogout()
        navigate('/')
      } else {
        setLastActivity()
      }
    }
    checkInitialActivity()
  }, [])

  useEffect(() => {
    const fetchUserAndSetLanguage = async () => {
      if (isLoggedIn) {
        try {
          const user = await usersService.getCurrentUser()
          if (user) {
            const lng = 'FI_fi'
            i18n.changeLanguage(lng)
          } else {
            const lng = navigator.language
            i18n.changeLanguage(lng)
          }
        } catch (error) {
          console.error(error)
          const lng = navigator.language
          i18n.changeLanguage(lng)
        }
      } else {
        const lng = navigator.language
        i18n.changeLanguage(lng)
      }
      setLanguageIsSet(true)
    }
    fetchUserAndSetLanguage()
  }, [i18n])

  useEffect(() => {
    if (isLoggedIn) {
      const updateActivity = () => setLastActivity()
      document.addEventListener('keypress', updateActivity)
      document.addEventListener('touchstart', updateActivity)

      return () => {
        document.removeEventListener('keypress', updateActivity)
        document.removeEventListener('touchstart', updateActivity)
      }
    }
  }, [isLoggedIn])

  const handleLogin = async () => {
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
    setLastActivity()
    navigate(t('paths.mainscreen'))
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        languageIsSet,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
