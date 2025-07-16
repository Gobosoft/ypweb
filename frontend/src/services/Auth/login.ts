import qs from 'qs'
import { AxiosResponse } from 'axios'
import { User } from '../../lib/types'
import axiosInstance from '../../axiosConfig'

const loginUrl = '/api/auth/login'
const resendUrl = '/api/auth/resend-verification'

interface UserData {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user?: User
  message?: string
}

const loginUser = async (userData: UserData): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(loginUrl, qs.stringify(userData), {
    withCredentials: true,
    validateStatus: (status: number) => {
      return (status >= 200 && status < 300) || status === 404 || status === 401
    },
  })
  return response
}

const resendVerificationEmail = async (
  email: string
): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(
    resendUrl,
    { email },
    {
      withCredentials: true,
    }
  )
  return response
}

export default { loginUser, resendVerificationEmail }
