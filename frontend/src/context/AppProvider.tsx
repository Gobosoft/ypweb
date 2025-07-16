import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'
import { CurrentUserState } from '../lib/types'
import usersService from '../services/Users/users'

interface AppProviderType {
  currentUser: CurrentUserState
  setCurrentUser: Dispatch<SetStateAction<CurrentUserState>>
  renderRefreshAlert: boolean
  setRenderRefreshAlert: Dispatch<SetStateAction<boolean>>
}

const AppContext = createContext<AppProviderType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserState>(
    {} as CurrentUserState
  )
  const [renderRefreshAlert, setRenderRefreshAlert] = useState<boolean>(false)

  const initializeCurrentUser = async (
    projectId?: string,
    customershipId?: string
  ) => {
    try {
      const response = await usersService.getCurrentUserStateData(
        projectId,
        customershipId
      )
      if (response.status === 200) {
        setCurrentUser(response.data)
      }
    } catch (error) {
      console.error('Error initializing current user:', error)
    }
  }

  const contextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      initializeCurrentUser,
      renderRefreshAlert,
      setRenderRefreshAlert,
    }),
    [
      currentUser,
      setCurrentUser,
      initializeCurrentUser,
      renderRefreshAlert,
      setRenderRefreshAlert,
    ]
  )

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export const useAppContext = (): AppProviderType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
