import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useAppContext } from './AppProvider'

const UserProvider = () => {
  const { initializeCurrentUser, currentUser } = useAppContext()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      await initializeCurrentUser()
    }
    fetchCurrentUser()
  }, [])

  console.log('Current User: ', currentUser)

  return <Outlet />
}
export default UserProvider
