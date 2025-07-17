import { Card } from 'src/components/ui/card'

const OrderDetailsCard = () => {
  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-2">Tarkemmat tilatiedot</h4>
      <p className="text-sm">
        <strong>1. messupäivä</strong>
        <br />
        Ständi: Koko iso
        <br />
        Vuokraketterä: Kyllä
        <br />
        Toivottu messupaikka: Tavarapuoti
        <br />
        Perusteltu: 0<br />
        Perustelut: 4
      </p>
    </Card>
  )
}

export default OrderDetailsCard
