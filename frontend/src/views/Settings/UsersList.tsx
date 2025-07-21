import React, { useEffect, useState } from 'react'
import { User } from 'src/lib/types'
import usersService from 'src/services/Users/users'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { Button } from 'src/components/ui/button'
import i18n from 'src/i18n'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'
import RegisterForm from 'src/components/Register/RegisterForm'
import { RefreshCcw } from 'lucide-react'

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    try {
      const res = await usersService.getAllUsers()
      setUsers(res.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="p-4">
      <div className="flex flex-row flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <h2 className="text-xl font-semibold mb-4">{i18n.t('users')}</h2>
          <Button
            variant={'secondary'}
            onClick={async () => {
              await fetchUsers()
            }}
          >
            <RefreshCcw />
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>{i18n.t('settingsView.addNewUser')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{i18n.t('settingsView.addNewUser')}</DialogTitle>
            </DialogHeader>
            <div>
              <RegisterForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{i18n.t('name')}</TableHead>
            <TableHead>{i18n.t('email')}</TableHead>
            <TableHead>{i18n.t('role')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default UsersList
