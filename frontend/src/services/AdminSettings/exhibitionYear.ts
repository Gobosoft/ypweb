import { ExhibitionYear } from 'src/lib/types'
import axiosInstance from '../../axiosConfig'

const baseUrl = '/api/admin'

const createExhibitionYear = (data: {
  year: number
  startDate: string
  endDate: string
}) => {
  return axiosInstance.post(`${baseUrl}/exhibition-years`, data)
}

export const fetchExhibitionYears = async (): Promise<ExhibitionYear[]> => {
  const response = await axiosInstance.get(`${baseUrl}/exhibition-years`)
  return response.data
}

export const activateExhibitionYear = async (id: number): Promise<void> => {
  await axiosInstance.post(`${baseUrl}/exhibition-years/${id}/activate`)
}

export default {
  createExhibitionYear,
  fetchExhibitionYears,
  activateExhibitionYear,
}
