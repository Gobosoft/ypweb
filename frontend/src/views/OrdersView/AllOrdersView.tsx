import React, { useEffect, useState } from 'react'
import { Order } from 'src/lib/types'
import ordersService from 'src/services/Orders/orders'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from 'src/components/ui/table'
import i18n from 'src/i18n'

const AllOrdersView = () => {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersService.getAllOrders()
        setOrders(res.data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{i18n.t('allOrders')}</h2>
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
            <TableRow key={order.id}>
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

export default AllOrdersView
