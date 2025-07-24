import { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { Label } from 'src/components/ui/label'
import productsService from 'src/services/Products/products'
import ordersService from 'src/services/Orders/orders'
import { Product } from 'src/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import i18n from 'src/i18n'
import { useParams } from 'react-router'

const validationSchema = Yup.object({
  product_id: Yup.string().uuid().required('Product is required'),
  amount: Yup.number().positive().required('Amount is required'),
  unit_price: Yup.number().positive().required('Unit price is required'),
})

const CreateOrderRowForm = () => {
  const { orderId } = useParams<{ orderId: string }>()

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const productsRes = await productsService.getAllProducts()
      setProducts(productsRes)
    }
    fetchData()
  }, [])

  return (
    <Formik
      initialValues={{
        product_id: '',
        amount: 1,
        unit_price: 0,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        if (!orderId) return
        await ordersService.createOrderRow(orderId, values)
        resetForm()
      }}
    >
      {({ handleChange, handleBlur, values, isSubmitting, setFieldValue }) => (
        <Form className="p-6 space-y-6 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold">{i18n.t('addOrderRow')}</h1>

          <div className="space-y-1">
            <Label htmlFor="product_id">Product</Label>
            <Select
              value={values.product_id}
              onValueChange={(val) => setFieldValue('product_id', val)}
            >
              <SelectTrigger id="product_id">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-red-500 text-sm">
              <ErrorMessage name="product_id" />
            </p>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              name="amount"
              type="number"
              value={values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <p className="text-red-500 text-sm">
              <ErrorMessage name="amount" />
            </p>
          </div>

          <div>
            <Label htmlFor="unit_price">Unit Price (€)</Label>
            <Input
              name="unit_price"
              type="number"
              value={values.unit_price}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <p className="text-red-500 text-sm">
              <ErrorMessage name="unit_price" />
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Order Row'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default CreateOrderRowForm
