import { Card } from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'

interface Props {
  name: string
  role: string
  email: string
  phone: string
  updated: string
}

const ContactCard = ({ name, role, email, phone, updated }: Props) => {
  return (
    <Card className="p-4 space-y-2">
      <p className="text-sm text-muted-foreground">
        päivitetty viimeksi {updated}
      </p>
      <h4 className="font-semibold">{name}</h4>
      <p className="text-sm">{email}</p>
      <p className="text-sm">{phone}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
      <div className="flex gap-2 pt-2">
        <Button variant="secondary" size="sm">
          Poista
        </Button>
        <Button size="sm">Muokkaa</Button>
      </div>
    </Card>
  )
}

export default ContactCard
