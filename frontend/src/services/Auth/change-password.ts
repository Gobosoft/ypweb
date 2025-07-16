import { AxiosResponse } from 'axios'
import axiosInstance from '../../axiosConfig'

const baseUrl = '/api/auth/change-password'

const sendChangePasswordMail = async ({
  email,
}: {
  email: string
}): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(`${baseUrl}/send-email`, { email })
  return response
}

const changePassword = async ({
  newPassword,
  token,
}: {
  newPassword: string
  token: string
}): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(`${baseUrl}/${token}`, {
    password: newPassword,
  })
  return response
}

export default { sendChangePasswordMail, changePassword }
