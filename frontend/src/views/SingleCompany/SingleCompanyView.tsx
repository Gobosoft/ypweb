import ContactCard from 'src/components/Contact/ContactCard'
import ContactInfoCard from 'src/components/Contact/ContactInfoCard'
import OrderDetailsCard from 'src/components/Order/OrderDetailsCard'
import CompanyNotesCard from 'src/components/Company/CompanyNotesCard'
import { Button } from 'src/components/ui/button'
import { Card } from 'src/components/ui/card'

const SingleCompanyView = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Yrityksen perustiedot */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CodeNest Labs</h2>
          <p className="text-muted-foreground">CodeNest Labs Finland Oy</p>
        </div>
        <Button>Muokkaa tietoja</Button>
      </div>

      {/* Yhteyshenkilöt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContactCard
          name="Maria Virtanen"
          role="Country Recruiting Manager, vaihteesta saatu"
          email="maria.virtanen@codenestlabs.com"
          phone="04512345678"
          updated="11.12.2024"
        />
        <ContactCard
          name="Pekka Korhonen"
          role="CEO, ollut Yrityspäivillä 2011 tiimissä"
          email="pekka.korhonen@codenestlabs.com"
          phone="04512345678"
          updated="11.12.2021"
        />
      </div>

      {/* Tilat ja koordinaattori */}
      <ContactInfoCard />

      {/* Alatiedot kortteina */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-1">
          <div className="p-4">
            <h4 className="font-semibold mb-2">Yhteydenotot yritykseen</h4>
            <p className="text-sm text-muted-foreground mb-1">
              päivitetty viimeksi 10.9.2025
            </p>
            <p className="text-sm">
              10.9.2025 – Maria Virtaseen saatu yhteys. Lähtivät mukaan. / Matti
              H
            </p>
          </div>
        </Card>
        <OrderDetailsCard />
        <CompanyNotesCard />
      </div>
    </div>
  )
}

export default SingleCompanyView
