import React from 'react'
import CreateOrderRowForm from 'src/components/Order/CreateOrderRowForm'
import OrderDetails from 'src/components/Order/OrderDetails'
import OrderRowsTable from 'src/components/Order/OrderRowsTable'
import UpdateOrderForm from 'src/components/Order/UpdateOrderForm'

const SingleOrderView = () => {
  return (
    <div className="p-6">
      <UpdateOrderForm />
      <CreateOrderRowForm />
      <OrderRowsTable />
      <OrderDetails />
    </div>
  )
}

export default SingleOrderView
