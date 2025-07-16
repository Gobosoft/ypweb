import React, { useState } from 'react'
import { Formik, Field, Form, FormikHelpers } from 'formik'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { toast } from 'react-toastify'
import registerService from '../../services/Register/register'
import { Link } from 'react-router-dom'
import FormErrorMessage from '../Forms/FormErrorMessage'
import { validationSchemaRegister } from '../../lib/validationSchemas'
import { Card, CardContent, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Eye, EyeOff } from 'lucide-react'
import i18n from '../../i18n'

interface RegisterFormValues {
  name: string
  email: string
  password: string
  verifyPassword: string
}

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleRegister = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    setSubmitting(true)

    try {
      const res = await registerService.registerUser({
        email: values.email,
        password: values.password,
        name: values.name,
      })
    } catch (error) {
      toast.error(i18n.t('registrationFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Card className="w-full max-w-md p-2">
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            verifyPassword: '',
          }}
          validationSchema={validationSchemaRegister}
          onSubmit={handleRegister}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <CardTitle className="mb-2 text-center">
                  {i18n.t('register')}
                </CardTitle>
                <Separator />
                <CardContent className="flex flex-col gap-3 w-full my-2">
                  <Label>{i18n.t('name')}</Label>
                  <Field
                    name="name"
                    type="text"
                    placeholder={i18n.t('name')}
                    className="bg-white text-black rounded-lg px-3 py-2"
                    as={Input}
                  />
                  <FormErrorMessage name="name" />
                  <Label>{i18n.t('email')}</Label>
                  <Field
                    name="email"
                    type="email"
                    placeholder={i18n.t('email')}
                    className="bg-white text-black rounded-lg px-3 py-2"
                    as={Input}
                  />
                  <FormErrorMessage name="email" />

                  <Label>{i18n.t('password')}</Label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={i18n.t('password')}
                      className="bg-white text-black rounded-lg px-3 py-2 w-full pr-10" // Add padding-right for the icon space
                      as={Input}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </span>
                  </div>
                  <FormErrorMessage name="password" />
                  <Label>{i18n.t('confirmPassword')}</Label>
                  <Field
                    name="verifyPassword"
                    type="password"
                    placeholder={i18n.t('confirmPassword')}
                    className="bg-white text-black rounded-lg px-3 py-2"
                    as={Input}
                  />
                  <FormErrorMessage name="verifyPassword" />

                  <Button type="submit" disabled={isSubmitting}>
                    {i18n.t('register')}
                  </Button>
                  <Link to={'/'}>
                    {i18n.t('alreadyHaveUser')}{' '}
                    <span className="underline">{i18n.t('logIn')}</span>
                  </Link>
                </CardContent>
              </Form>
            )
          }}
        </Formik>
      </Card>
    </div>
  )
}

export default RegisterForm
