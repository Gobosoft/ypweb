import { ErrorMessage } from 'formik'
import React from 'react'

interface Props {
  name: string
}

const FormErrorMessage = ({ name }: Props) => {
  return (
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  )
}

export default FormErrorMessage
