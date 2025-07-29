import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Input } from '../ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import i18n from 'src/i18n'
import { Label } from '../ui/label'
import loginService from 'src/services/Auth/login'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '../ui/card'
import { Separator } from '../ui/separator'
import { Field, Form, Formik } from 'formik'
import FormErrorMessage from '../Forms/FormErrorMessage'
import * as Yup from 'yup'
import { Eye, EyeOff } from 'lucide-react'
import { displayResponseErrorMessage } from 'src/lib/utils'
import PendingSubmitButton from '../Buttons/PendingSubmitButton'
import { useAppContext } from 'src/context/AppProvider'

const stylesForText =
  'block uppercase tracking-wide text-black-700 text-sm font-bold'

interface LoginProps {
  onLoginSuccess: () => void
}

interface LoginFormValues {
  email: string
  password: string
}

const LoginForm = ({ onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState<string>('')
  const [showResendLink, setShowResendLink] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const { initializeCurrentUser } = useAppContext()

  const navigate = useNavigate()

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await loginService.loginUser({
        username: values.email,
        password: values.password,
      })
      const user = response.data
      if (response.status === 200 && user) {
        onLoginSuccess()
        initializeCurrentUser()
        navigate(i18n.t('paths.mainscreen'))
      } else {
        if (response.status === 404) {
          toast.error(i18n.t('authMessages.loginFailed'))
        } else if (response.status === 401) {
          toast.warning(i18n.t('authMessages.emailNotVerified'))
          setShowResendLink(true)
          setEmail(values.email)
        }
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast.error(i18n.t('limiter.login'))
      } else if (error.response?.status === 403) {
        setEmail(values.email)
        toast.warning(i18n.t('authMessages.passwordMustBeChanged'))
      } else {
        displayResponseErrorMessage(error)
      }
    }
  }

  const handleResendVerification = async () => {
    if (!email || email.length === 0) {
      return
    }
    try {
      const response = await loginService.resendVerificationEmail(email)
      if (response.status === 200) {
        toast.success(i18n.t('authMessages.verificationEmailSent'))
      } else {
        toast.error(i18n.t('authMessages.verificationEmailFailed'))
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast.error(i18n.t('limiter.verifyEmail'))
      } else {
        displayResponseErrorMessage(error)
      }
    }
  }

  return (
    <div data-testid="login-container" className="spacer background1 p-2">
      {showResendLink && (
        <div className="my-4 flex flex-col items-center">
          <Card
            className="w-full max-w-md"
            data-testid="login-view-resend-email-suggestion-card"
          >
            <CardTitle className="mb-2 text-center">
              {i18n.t('youNeedToConfirmEmail')}
            </CardTitle>
            <Separator className="my-3" />
            <CardDescription>{i18n.t('emailConfirmationSent')}</CardDescription>
            <Separator className="my-3" />
            <CardFooter className="flex flex-col gap-3 mt-2">
              <p>{i18n.t('questionDidntReceiveEmail')}</p>
              <p>{i18n.t('loginFormEmailResendInstructions')}</p>
              <p>
                {i18n.t('confirmationEmailWillBeSentTo')}: {email}
              </p>
              <Button
                disabled={!email}
                onClick={handleResendVerification}
                data-testid="resend-verification-link"
              >
                {i18n.t('sendNewConfirmationEmail')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      <div>
        <div className="flex flex-col gap-2 w-full col-span-1 items-center">
          <h1 className="sm:text-4xl text-2xl mb-2 text-center">
            {i18n.t('YPWEB')}
          </h1>
          <Card className="w-full max-w-md">
            <CardTitle className="text-center">{i18n.t('logIn')}</CardTitle>
            <Separator className="my-3" />
            <CardContent>
              <Formik
                initialValues={{
                  email: '',
                  password: '',
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email(i18n.t('emailValidation.invalidFormat'))
                    .required(i18n.t('fieldValidation.required')),
                  password: Yup.string().required(
                    i18n.t('fieldValidation.required')
                  ),
                })}
                onSubmit={handleLogin}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form
                    className="flex flex-col gap-3"
                    data-testid="login-form"
                  >
                    <Label className={stylesForText}>{i18n.t('email')}</Label>
                    <Field
                      type="email"
                      name="email"
                      placeholder={i18n.t('email')}
                      className="bg-white text-black rounded-lg px-3 py-2"
                      data-testid="email-input"
                      as={Input}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('email', e.target.value)
                      }}
                    />
                    <FormErrorMessage name="email" />
                    <Label className={stylesForText}>
                      {i18n.t('password')}
                    </Label>
                    <div className="relative">
                      <Field
                        name="password"
                        data-testid="password-input"
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
                    <PendingSubmitButton
                      isSubmitting={isSubmitting}
                      buttonText={i18n.t('logIn')}
                      data-testid="login-button"
                    />
                  </Form>
                )}
              </Formik>
              <Link
                to={i18n.t('paths.forgotpassword')}
                data-testid="forgot-password-link"
              >
                <span className="underline">{i18n.t('forgotPassword')}</span>
              </Link>
            </CardContent>
          </Card>
          <Card className="w-full max-w-md">
            <CardTitle className="text-center">
              {i18n.t('dontHaveUserYet')}
            </CardTitle>
            <Separator className="my-3" />
            <CardContent>
              <Link
                to={i18n.t('paths.register')}
                data-testid="redirect-to-register"
              >
                <Button className="w-full">{i18n.t('register')}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
