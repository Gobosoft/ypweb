import { Card } from 'src/components/ui/card'
import { CompanyDetail } from 'src/lib/types'

interface Props {
  company: CompanyDetail
}

const formatDate = (date?: string | null) => {
  if (!date) return '-'
  const d = new Date(date)
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
}

const CompanyInfoCard = ({ company }: Props) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Yhteystiedot ja tila</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Asiakaskoordinaattori</p>
          <p>{company.coordinator_name || '-'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Yhteys saatu</p>
          <p>
            {company.latest_contact_log?.contact_status
              ? company.latest_contact_log.contact_status
              : 'Ei tietoa'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">1. messupäivä</p>
          <p>{company.first_day_booth || '-'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">2. messupäivä</p>
          <p>{company.second_day_booth || '-'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Sopimus palautettu</p>
          <p>{formatDate(company.contract_returned_date)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Materiaalit vastaanotettu</p>
          <p>{formatDate(company.material_returned_date)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Lasku lähetetty</p>
          <p>{formatDate(company.invoice_sent_date)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Maksu vastaanotettu</p>
          <p>{formatDate(company.invoice_paid_date)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">
            Saapumisilmoitus vastaanotettu
          </p>
          <p>{formatDate(company.arrival_info_date)}</p>
        </div>
      </div>
    </Card>
  )
}

export default CompanyInfoCard
