import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Order, OrderStatus, OrderType } from 'src/lib/types'
import ordersService from 'src/services/Orders/orders'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from 'src/components/ui/select'
import { Label } from 'src/components/ui/label'
import { format } from 'date-fns'

const SingleOrderView = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = async () => {
    if (!orderId) return
    try {
      const response = await ordersService.getById(orderId)
      setOrder(response.data)
    } catch (error) {
      console.error('Failed to fetch order', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const handleChange = (field: keyof Order, value: any) => {
    if (!order) return
    setOrder({ ...order, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId || !order) return

    try {
      await ordersService.updateOrder(orderId, order)
      alert('Order updated!')
    } catch (error) {
      console.error('Failed to update order', error)
      alert('Update failed')
    }
  }

  if (loading || !order) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Update Order</h1>

      <div>
        <Label htmlFor="order_date">Order Date</Label>
        <Input
          type="date"
          id="order_date"
          value={format(new Date(order.order_date), 'yyyy-MM-dd')}
          onChange={(e) => handleChange('order_date', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="order_type">Order Type</Label>
        <Select
          value={order.order_type}
          onValueChange={(val) => handleChange('order_type', val as OrderType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(OrderType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={order.status}
          onValueChange={(val) => handleChange('status', val as OrderStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(OrderStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="portal_uuid">Portal UUID</Label>
        <Input
          id="portal_uuid"
          value={order.portal_uuid}
          onChange={(e) => handleChange('portal_uuid', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="attendance_confirmed">Attendance Confirmed</Label>
        <Select
          value={String(order.attendance_confirmed)}
          onValueChange={(val) =>
            handleChange('attendance_confirmed', val === 'true')
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Update Order</Button>
    </form>
  )
}

export default SingleOrderView
