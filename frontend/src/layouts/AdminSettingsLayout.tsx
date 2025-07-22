import React from 'react'
import { Outlet } from 'react-router'
import { useAppContext } from 'src/context/AppProvider'
import { UserRole } from 'src/lib/types'

const AdminSettingsLayout = () => {
  const { currentUser } = useAppContext()

  console.log('Cur', currentUser)

  if (currentUser?.userData?.role !== UserRole.IT) {
    return <div>Admin role required to access this page</div>
  }

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default AdminSettingsLayout
