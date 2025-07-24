import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
import { ArrivalInfo, Contract, Invoice, Material } from 'src/lib/types'
import ordersService from 'src/services/Orders/orders'

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>()

  const [materials, setMaterials] = useState<Material[]>([])
  const [arrivalInfos, setArrivalInfos] = useState<ArrivalInfo[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return
      try {
        const [matsRes, arrivalsRes, contractsRes, invoicesRes] =
          await Promise.all([
            ordersService.getMaterialsByOrderId(orderId),
            ordersService.getArrivalInfosByOrderId(orderId),
            ordersService.getContractsByOrderId(orderId),
            ordersService.getInvoicesByOrderId(orderId),
          ])
        setMaterials(matsRes.data)
        setArrivalInfos(arrivalsRes.data)
        setContracts(contractsRes.data)
        setInvoices(invoicesRes.data)
      } catch (err) {
        console.error('Error fetching order data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [orderId])

  if (loading) return <p>Loading...</p>

  console.log('arrivals: ', arrivalInfos)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {/* Materials */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Materials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {materials.length === 0 ? (
              <p className="text-muted-foreground">No materials found.</p>
            ) : (
              materials.map((mat) => (
                <div key={mat.id} className="border rounded p-2">
                  <p>
                    <strong>Type:</strong> {mat.type}
                  </p>
                  <p>
                    <strong>File:</strong> {mat.file_name}
                  </p>
                  <p>
                    <strong>Returned:</strong>{' '}
                    {new Date(mat.returned_date).toLocaleDateString()}
                  </p>
                  <a
                    href={mat.file_path}
                    className="text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Arrival Info */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Arrival Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {arrivalInfos.length === 0 ? (
              <p className="text-muted-foreground">
                No arrival info submitted.
              </p>
            ) : (
              arrivalInfos.map((info) => (
                <div key={info.id} className="border rounded p-2">
                  <p>
                    <strong>Lunch:</strong> {info.lunch_count}
                  </p>
                  <p>
                    <strong>Cocktail:</strong> {info.cocktail_count}
                  </p>
                  <p>
                    <strong>Dietary:</strong> {info.dietary_restrictions}
                  </p>
                  <p>
                    <strong>Goods:</strong> {info.goods_sending}
                  </p>
                  <p>
                    <strong>Returned:</strong>{' '}
                    {new Date(info.returned_date).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contracts */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Contracts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contracts.length === 0 ? (
              <p className="text-muted-foreground">No contracts submitted.</p>
            ) : (
              contracts.map((con) => (
                <div key={con.id} className="border rounded p-2">
                  <p>
                    <strong>File:</strong> {con.file_name}
                  </p>
                  <p>
                    <strong>Returned:</strong> {con.is_returned ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Signed:</strong> {con.is_signed ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Returned Date:</strong>{' '}
                    {new Date(con.returned_date).toLocaleDateString()}
                  </p>
                  <a
                    href={con.file_path}
                    className="text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {invoices.length === 0 ? (
              <p className="text-muted-foreground">No invoices submitted.</p>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="border rounded p-2">
                  <p>
                    <strong>Reference:</strong> {invoice.reference}
                  </p>
                  <p>
                    <strong>Sum:</strong> €{invoice.sum.toFixed(2)}
                  </p>
                  <p>
                    <strong>Invoice Date:</strong>{' '}
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{' '}
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Sent:</strong> {invoice.is_sent ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Paid:</strong> {invoice.is_paid ? 'Yes' : 'No'}
                  </p>
                  {invoice.special_info && (
                    <p>
                      <strong>Special Info:</strong> {invoice.special_info}
                    </p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrderDetails
