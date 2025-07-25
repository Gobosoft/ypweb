import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/table'
import { OrderRow } from 'src/lib/types'
import ordersService from 'src/services/Orders/orders'

const OrderRowsTable = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const [orderRows, setOrderRows] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderRows = async () => {
      if (!orderId) return
      try {
        const data = await ordersService.getOrderRowsByOrderId(orderId)
        setOrderRows(data.data)
      } catch (error) {
        console.error('Failed to fetch order rows:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderRows()
  }, [orderId])

  if (loading) {
    return <div className="space-y-2">Ladataan</div>
  }

  if (orderRows.length === 0) {
    return (
      <p className="text-muted-foreground">
        No order rows found for this order.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <h2>Tilausrivit</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.product_id}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.unit_price.toFixed(2)} €</TableCell>
              <TableCell>
                {(row.amount * row.unit_price).toFixed(2)} €
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default OrderRowsTable
