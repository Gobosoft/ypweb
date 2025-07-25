import { useState } from 'react'
import { Card } from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'
import { Contact } from 'src/lib/types'
import EditContactDialog from './EditContactDialog'
import contactService from 'src/services/Contacts/contact'
import { toast } from 'react-toastify'

interface Props {
  contact: Contact
  companyId: string
  onUpdate?: () => void
  isPlaceholder?: boolean
}

const ContactCard = ({
  contact,
  companyId,
  onUpdate,
  isPlaceholder,
}: Props) => {
  const [deleting, setDeleting] = useState(false)
  const isEditMode = !isPlaceholder

  const handleDelete = async () => {
    if (!window.confirm('Haluatko varmasti poistaa tämän yhteyshenkilön?'))
      return
    try {
      setDeleting(true)
      await contactService.deleteContact(companyId, contact.id)
      toast.success('Yhteyshenkilö poistettu')
      onUpdate?.()
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Poistaminen epäonnistui')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="p-4 space-y-2">
      <p className="text-sm text-muted-foreground">Yhteyshenkilö</p>
      <h4 className="font-semibold">{contact.name}</h4>
      <p className="text-sm">{contact.email}</p>
      <p className="text-sm">{contact.phone || '-'}</p>
      <p className="text-sm text-muted-foreground">
        {contact.is_primary ? 'Pääyhteyshenkilö' : contact.description || ''}
      </p>
      <div className="flex gap-2 pt-2">
        {isEditMode && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Poistetaan...' : 'Poista'}
            </Button>
            <EditContactDialog
              contact={contact}
              companyId={companyId}
              onSuccess={onUpdate}
              mode="edit"
            />
          </>
        )}
        {!isEditMode && (
          <EditContactDialog
            contact={contact}
            companyId={companyId}
            onSuccess={onUpdate}
            mode="create"
          />
        )}
      </div>
    </Card>
  )
}

export default ContactCard
