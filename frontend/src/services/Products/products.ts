import axiosInstance from 'src/axiosConfig'
import { Product } from 'src/lib/types'

const baseUrl = '/api/products'

const createProduct = async (data: any) => {
  const response = await axiosInstance.post(`${baseUrl}/create`, data)
  return response.data
}

const getAllProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get(`${baseUrl}/all`)
  return res.data
}

export default {
  createProduct,
  getAllProducts,
}
