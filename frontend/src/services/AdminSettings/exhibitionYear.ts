import { Building, ExhibitionYear } from 'src/lib/types'
import axiosInstance from '../../axiosConfig'

const baseUrl = '/api/admin'

const createExhibitionYear = (data: {
  year: number
  startDate: string
  endDate: string
}) => {
  return axiosInstance.post(`${baseUrl}/exhibition-years`, data)
}

const fetchExhibitionYears = async (): Promise<ExhibitionYear[]> => {
  const response = await axiosInstance.get(`${baseUrl}/exhibition-years`)
  return response.data
}

const activateExhibitionYear = async (id: number): Promise<void> => {
  await axiosInstance.post(`${baseUrl}/exhibition-years/${id}/activate`)
}

const fetchBuildings = async (): Promise<Building[]> => {
  const response = await axiosInstance.get(`${baseUrl}/buildings`)
  return response.data
}

export default {
  createExhibitionYear,
  fetchExhibitionYears,
  activateExhibitionYear,
  fetchBuildings,
}
