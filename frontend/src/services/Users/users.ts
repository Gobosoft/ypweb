import { AxiosResponse } from 'axios'
import axiosInstance from '../../axiosConfig'
import { User } from '../../lib/types'

const baseUrl = '/api/users'

interface UpdateUserData {
  language?: string
  phone?: string
  organization?: string
}

export type SearchUsersProps = {
  page: number
  search: string
  results_per_page: number
}

const getCurrentUser = async (): Promise<User | null> => {
  const request = await axiosInstance.get(`${baseUrl}/me`)
  if (request.status !== 200) {
    return null
  }
  return request.data as User
}

const getCurrentUserStateData = async (): Promise<AxiosResponse> => {
  const url = `${baseUrl}/me/state`
  const response = await axiosInstance.get(url)

  return response
}

const getAllUsers = async (): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(`${baseUrl}/get-all-users`)
  return response
}

const updateCurrentUserData = async (
  userData: UpdateUserData
): Promise<AxiosResponse> => {
  const response = await axiosInstance.put(
    `${baseUrl}/update-user-data`,
    userData
  )
  return response
}

const deleteCurrentUser = async (): Promise<AxiosResponse> => {
  const response = await axiosInstance.delete(`${baseUrl}/delete-current-user`)
  return response
}

const getUsersByCustomershipId = async (
  customership_id: string
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(
    `${baseUrl}/customerships/${customership_id}`
  )
  return response
}

const getProjectUserInfoDataByEmail = async (
  userEmail: string,
  project_id: string
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(
    `${baseUrl}/projects/${project_id}/info/${userEmail}`
  )
  return response
}

const getCustomershipUserInfoDataByEmail = async (
  userEmail: string,
  customership_id: string
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(
    `${baseUrl}/customerships/${customership_id}/info/${userEmail}`
  )
  return response
}

const searchUsersByProjectId = async (
  project_id: string,
  searchProps: SearchUsersProps
): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(
    `${baseUrl}/projects/${project_id}/search`,
    searchProps
  )
  return response
}

const searchUsersByCustomershipId = async (
  project_id: string,
  searchProps: SearchUsersProps
): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(
    `${baseUrl}/customerships/${project_id}/search`,
    searchProps
  )
  return response
}

const verifyCrmAccess = async (): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(`/api/crm/verify-access`)
  return response
}

export default {
  getCurrentUser,
  getAllUsers,
  updateCurrentUserData,
  deleteCurrentUser,
  getCurrentUserStateData,
  getUsersByCustomershipId,
  getProjectUserInfoDataByEmail,
  getCustomershipUserInfoDataByEmail,
  searchUsersByProjectId,
  searchUsersByCustomershipId,
  verifyCrmAccess,
}
