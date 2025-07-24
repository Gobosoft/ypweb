import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ContactCard from 'src/components/Contact/ContactCard'
import ContactInfoCard from 'src/components/Contact/ContactInfoCard'
import OrderDetailsCard from 'src/components/Order/OrderDetailsCard'
import CompanyNotesCard from 'src/components/Company/CompanyNotesCard'
import { Button } from 'src/components/ui/button'
import { Card } from 'src/components/ui/card'
import companyService from 'src/services/Companies/companyService'
import { Company } from 'src/lib/types'
import SmallLoadingCircleOnly from 'src/components/Loading/SmallLoadingCircle'
import { toast } from 'react-toastify'

const SingleCompanyView = () => {
  const { id: companyId } = useParams<{ id: string }>()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) return
      try {
        const result = await companyService.getCompanyById(companyId)
        if (result) {
          setCompany(result)
        } else {
          toast.error('Yrityksen tietoja ei löytynyt')
        }
      } catch (err) {
        toast.error('Virhe haettaessa yrityksen tietoja')
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [companyId])

  if (loading) return <SmallLoadingCircleOnly />

  if (!company) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Yrityksen tietoja ei löytynyt.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Yrityksen perustiedot */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{company.display_name}</h2>
          <p className="text-muted-foreground">{company.name}</p>
        </div>
        <Button>Muokkaa tietoja</Button>
      </div>

      {/* Yhteyshenkilöt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tämä pitää myöhemmin korvata dynaamisella contact-haulla */}
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
