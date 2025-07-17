import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import i18n from '../../i18n'
import axiosInstance from '../../axiosConfig'

const baseUrl = '/api/auth/register'

interface UserData {
  name: string
  email: string
  password: string
}

interface ApiResponse {
  message: string
}

const registerUser = async (userData: UserData) => {
  try {
    const response = await axiosInstance.post<ApiResponse>(baseUrl, userData)
    toast.success(i18n.t('authMessages.registrationSuccess'))
    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse>
    if (axiosError.response) {
      // Specific check for status code 400
      if (axiosError.response.status === 400) {
        if (axiosError.response.data.message === 'User already exists') {
          console.error(
            'Registration failed - User already exists:',
            axiosError.response.data
          )
          toast.error(i18n.t('authMessages.userAlreadyExists'))
        } else {
          console.error('failed captcha')
          toast.error(i18n.t('authMessages.failedCaptcha'))
        }
        return null
      } else if (axiosError.response.status === 429) {
        console.error('Registration failed - Too many requests')
        toast.error(i18n.t('limiter.register'))
        return null
      }
    }
    console.error('Error setting up registration request:', axiosError.message)
    toast.error(i18n.t('authMessages.unexpectedError'))
    return null
  }
}

export default { registerUser }
