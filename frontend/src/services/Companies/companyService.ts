import axiosInstance from 'src/axiosConfig'
import { Company, CompanyDetail } from 'src/lib/types'

const baseUrl = '/api/companies'

export interface CompanyCreatePayload {
  name: string
  business_id: string
  display_name?: string
  booth_size?: string
  special_requests?: string
  coordinator_name?: string
}

const createCompany = async (
  payload: CompanyCreatePayload
): Promise<Company | null> => {
  try {
    const response = await axiosInstance.post<Company>(
      `${baseUrl}/add-new`,
      payload
    )
    return response.data
  } catch (error: unknown) {
    return null
  }
}

const getAllCompanies = async (): Promise<Company[] | null> => {
  try {
    const response = await axiosInstance.get<Company[]>(`${baseUrl}/all`)
    return response.data
  } catch (error) {
    return null
  }
}

const getCompanyById = async (id: string): Promise<Company | null> => {
  try {
    const response = await axiosInstance.get<Company>(`${baseUrl}/${id}`)
    return response.data
  } catch (error) {
    return null
  }
}

const getCompanyDetailById = async (
  id: string
): Promise<CompanyDetail | null> => {
  try {
    const response = await axiosInstance.get<CompanyDetail>(
      `${baseUrl}/detail/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Failed to fetch company detail:', error)
    return null
  }
}

export default {
  createCompany,
  getAllCompanies,
  getCompanyById,
  getCompanyDetailById,
}
