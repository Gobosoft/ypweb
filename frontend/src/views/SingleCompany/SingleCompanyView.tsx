import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ContactCard from 'src/components/Contact/ContactCard'
import CompanyInfoCard from 'src/components/Company/CompanyInfoCard'
import ContactStatusCard from 'src/components/Contact/ContactStatusCard'
import OrderDetailsCard from 'src/components/Order/OrderDetailsCard'
import CompanyNotesCard from 'src/components/Company/CompanyNotesCard'
import { Button } from 'src/components/ui/button'
import companyService from 'src/services/Companies/companyService'
import { CompanyDetail } from 'src/lib/types'
import SmallLoadingCircleOnly from 'src/components/Loading/SmallLoadingCircle'
import { toast } from 'react-toastify'
import i18n from 'src/i18n'

const SingleCompanyView = () => {
  const { companyId } = useParams()
  const [company, setCompany] = useState<CompanyDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchCompany = async () => {
    if (!companyId) {
      toast.error('Virheellinen yrityksen tunniste')
      return
    }

    try {
      setLoading(true)
      const result = await companyService.getCompanyDetailById(companyId)
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

  useEffect(() => {
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
        <div className="flex gap-2 flex-wrap">
          <Button asChild>
            <Link to={i18n.t('paths.orders')}>{i18n.t('orders')}</Link>
          </Button>
          <Button>Muokkaa tietoja</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {company.contacts.map((contact) => (
          <ContactCard
            key={`${contact.id}-${contact.name}-${contact.email}-${contact.phone ?? ''}`}
            contact={contact}
            companyId={company.id}
            onUpdate={fetchCompany}
          />
        ))}
        {Array.from({ length: Math.max(0, 2 - company.contacts.length) }).map(
          (_, idx) => (
            <ContactCard
              key={`placeholder-${idx}`}
              contact={{
                id: `placeholder-${idx}`,
                name: '–',
                email: '–',
                phone: '–',
                is_primary: false,
                description: '',
              }}
              companyId={company.id}
              isPlaceholder
            />
          )
        )}
      </div>
      <CompanyInfoCard company={company} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ContactStatusCard company={company} refetch={fetchCompany} />
        <OrderDetailsCard />
        <CompanyNotesCard />
      </div>
    </div>
  )
}

export default SingleCompanyView
