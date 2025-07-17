import { Card } from 'src/components/ui/card'

const ContactInfoCard = () => {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Asiakaskoordinaattori</p>
          <p>Matti H</p>
        </div>
        <div>
          <p className="text-muted-foreground">Yhteys saatu</p>
          <p>Kyllä</p>
        </div>
        <div>
          <p className="text-muted-foreground">1. messupäivä</p>
          <p>pieni</p>
        </div>
        <div>
          <p className="text-muted-foreground">2. messupäivä</p>
          <p>-</p>
        </div>
        <div>
          <p className="text-muted-foreground">Sopimus palautettu</p>
          <p>12.9.</p>
        </div>
        <div>
          <p className="text-muted-foreground">Materiaalit vastaanotettu</p>
          <p>12.9.</p>
        </div>
        <div>
          <p className="text-muted-foreground">Lasku lähetetty</p>
          <p>17.9.</p>
        </div>
        <div>
          <p className="text-muted-foreground">Maksu vastaanotettu</p>
          <p>20.11.</p>
        </div>
        <div>
          <p className="text-muted-foreground">
            Saapumisilmoitus vastaanotettu
          </p>
          <p>17.12.</p>
        </div>
      </div>
    </Card>
  )
}

export default ContactInfoCard
