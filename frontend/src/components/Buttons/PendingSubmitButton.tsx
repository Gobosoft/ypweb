import { ReactNode } from 'react'
import SmallLoadingCircleOnly from '../Loading/SmallLoadingCircle'
import { Button } from '../ui/button'

export default function PendingSubmitButton({
  buttonText,
  isSubmitting,
  ...rest
}: {
  buttonText: ReactNode
  isSubmitting: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      aria-disabled={isSubmitting}
      type="submit"
      data-testid={'pending-submit-button'}
      {...rest}
    >
      {isSubmitting ? (
        <SmallLoadingCircleOnly borderColor="border-white" />
      ) : (
        buttonText
      )}
    </Button>
  )
}
