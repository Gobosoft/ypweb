import axiosInstance from '../../axiosConfig'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import i18n from '../../i18n'

const baseUrl = 'api/auth/verify-email/'

interface LoginResponse {
  success: boolean
  message: string
}

interface ApiResponse {
  message: string
}

const verifyEmail = async (token: string): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.get<LoginResponse>(
      `${baseUrl}${token}`
    )
    return { success: true, message: 'Email verified successfully!' }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ApiResponse>
    if (axiosError.response) {
      // Specific check for status code 400
      if (axiosError.response.status === 401) {
        console.error('Verification failed:', axiosError.response.data)
        toast.error(i18n.t('authMessages.tokenInvalidOrUsed'))
        return { success: false, message: 'Email is verified already' }
      } else if (axiosError.response.status === 403) {
        console.error('Verification failed:', axiosError.response.data)
        toast.error(i18n.t('authMessages.tokenExpired'))
        return { success: false, message: 'Token has expired' }
      } else if (axiosError.response.status === 429) {
        toast.error(i18n.t('limiter.verifyEmail'))
        return { success: false, message: 'Too many requests' }
      }
    }
    console.error('Error setting up registration request:', axiosError.message)
    toast.error(i18n.t('authMessages.unexpectedError'))
    return { success: false, message: 'Unexpected error occured' }
  }
}

export default { verifyEmail }
