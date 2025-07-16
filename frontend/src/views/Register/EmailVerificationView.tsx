import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import verificationService from '../../services/Auth/verifyEmail'
import { toast } from 'react-toastify'
import i18n from '../../i18n'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import { Button } from '../../components/ui/button'

const EmailVerificationView = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()

  const handleVerifyEmail = async () => {
    if (!token) {
      toast.error(i18n.t('authMessages.tokenMissing'))
      return
    }
    const { success } = await verificationService.verifyEmail(token)
    if (success) {
      toast.success(i18n.t('authMessages.emailVerified'))
      navigate('/')
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Card
        className="w-full max-w-md my-2"
        data-testid="email-verification-card"
      >
        <CardTitle>{i18n.t('authMessages.verifyYourEmail')}</CardTitle>
        <Separator className="my-3" />
        <CardDescription>{i18n.t('authMessages.veryfiInfo')}</CardDescription>
        <Separator className="my-3" />
        <CardContent className="flex flex-col gap-3">
          <Button
            data-testid="verify-email-button"
            type="button"
            onClick={handleVerifyEmail}
          >
            {i18n.t('authMessages.clickVerify')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailVerificationView
