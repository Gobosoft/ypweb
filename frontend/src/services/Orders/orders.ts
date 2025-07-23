import axiosInstance from 'src/axiosConfig'
import { Order, OrderRow } from 'src/lib/types'

const baseUrl = '/api/orders'

export type OrderRowPayload = {
  product_id: string
  amount: number
  unit_price: number
}

const getAllOrders = async () => {
  return axiosInstance.get<Order[]>(`${baseUrl}/all`)
}

const getByCompanyId = (companyId: string) => {
  return axiosInstance.get<Order[]>(`${baseUrl}/company/${companyId}`)
}

const getById = (id: string) => axiosInstance.get<Order>(`${baseUrl}/${id}`)
const updateOrder = (id: string, order: Partial<Order>) =>
  axiosInstance.put(`${baseUrl}/update/${id}`, order)

const createOrderRow = async (orderId: string, data: OrderRowPayload) => {
  const res = await axiosInstance.post(
    `${baseUrl}/${orderId}/create-order-row`,
    data
  )
  return res.data
}

const getOrderRowsByOrderId = (orderId: string) => {
  return axiosInstance.get<OrderRow[]>(`${baseUrl}/${orderId}/order-rows`)
}

export default {
  getAllOrders,
  getByCompanyId,
  getById,
  updateOrder,
  createOrderRow,
  getOrderRowsByOrderId,
}
