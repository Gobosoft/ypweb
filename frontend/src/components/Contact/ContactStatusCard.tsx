import { Card } from 'src/components/ui/card'
import AddContactNoteDialog from 'src/components/Contact/AddContactNoteDialog'
import { CompanyDetail } from 'src/lib/types'
import { format } from 'date-fns'
import { fi } from 'date-fns/locale'

interface Props {
  company: CompanyDetail
  refetch: () => void
}

const formatDate = (date?: string | null) => {
  if (!date) return '-'
  const parsed = new Date(date)
  return format(parsed, 'd.M.yyyy', { locale: fi })
}

const ContactStatusCard = ({ company, refetch }: Props) => {
  const log = company.latest_contact_log

  return (
    <Card className="col-span-1 md:col-span-1">
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">Yhteydenotot yritykseen</h4>
          <AddContactNoteDialog companyId={company.id} onAddSuccess={refetch} />
        </div>

        {log ? (
          <>
            <p className="text-sm text-muted-foreground">
              päivitetty viimeksi {formatDate(log.updated_at)}
            </p>
            <p className="text-sm">{log.text}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Ei kommentteja</p>
        )}
      </div>
    </Card>
  )
}

export default ContactStatusCard
