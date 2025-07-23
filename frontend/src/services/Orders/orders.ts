import axiosInstance from 'src/axiosConfig'
import { Order } from 'src/lib/types'

const getAllOrders = async () => {
  return axiosInstance.get<Order[]>('/api/orders/all')
}

export default {
  getAllOrders,
}
