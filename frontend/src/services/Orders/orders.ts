import axiosInstance from 'src/axiosConfig'
import { Order } from 'src/lib/types'

const baseUrl = '/api/orders'

const getAllOrders = async () => {
  return axiosInstance.get<Order[]>(`${baseUrl}/all`)
}

const getByCompanyId = (companyId: string) => {
  return axiosInstance.get<Order[]>(`${baseUrl}/company/${companyId}`)
}

const getById = (id: string) => axiosInstance.get<Order>(`${baseUrl}/${id}`)
const updateOrder = (id: string, order: Partial<Order>) =>
  axiosInstance.put(`${baseUrl}/update/${id}`, order)

export default {
  getAllOrders,
  getByCompanyId,
  getById,
  updateOrder,
}
