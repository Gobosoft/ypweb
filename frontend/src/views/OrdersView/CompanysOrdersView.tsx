import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ordersService from 'src/services/Orders/orders'
import { Order } from 'src/lib/types'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from 'src/components/ui/table'
import i18n from 'src/i18n'

const CompanysOrdersView = () => {
  const { companyId } = useParams<{ companyId: string }>()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!companyId) return
        const response = await ordersService.getByCompanyId(companyId)
        setOrders(response.data)
      } catch (err) {
        console.error('Error fetching company orders:', err)
      }
    }

    fetchOrders()
  }, [companyId])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Company Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Portal UUID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="hover:bg-muted cursor-pointer"
              onClick={() => navigate(order.id)}
            >
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.order_date}</TableCell>
              <TableCell>{order.order_type}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.attendance_confirmed ? 'Yes' : 'No'}</TableCell>
              <TableCell>{order.portal_uuid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CompanysOrdersView
