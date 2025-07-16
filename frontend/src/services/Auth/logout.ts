import axiosInstance from '../../axiosConfig'
import { updateLocalStorage } from './token'
import { toast } from 'react-toastify'
import i18n from '../../i18n'

const baseUrl = '/api/auth/logout'

interface LogoutResponse {
  message: string
  [key: string]: any
}

const logoutUser = async (): Promise<LogoutResponse | null> => {
  try {
    const response = await axiosInstance.post<LogoutResponse>(baseUrl, null, {
      withCredentials: true,
    })
    updateLocalStorage()
    toast.success(i18n.t('authMessages.logoutSuccess'))
    return response.data
  } catch (error: any) {
    if (error.name !== 'CanceledError') {
      toast.error(i18n.t('authMessages.logoutFailed'))
    }
    return null
  }
}

export default { logoutUser }
