import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'
import { Button } from 'src/components/ui/button'
import { Label } from 'src/components/ui/label'
import { Textarea } from 'src/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from 'src/components/ui/select'
import { Pencil } from 'lucide-react'
import { toast } from 'react-toastify'
import { Formik, Form, Field } from 'formik'
import commentService from 'src/services/Contacts/contact'
import { ContactStatus } from 'src/lib/types'

interface Props {
  companyId: string
  onAddSuccess?: () => void
}

const AddContactNoteDialog = ({ companyId, onAddSuccess }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [status, setStatus] = useState<ContactStatus | undefined>(undefined)

  const initialValues = {
    text: '',
  }

  const handleSubmit = async (values: typeof initialValues, actions: any) => {
    try {
      const success = await commentService.addCompanyContactNote({
        company_id: companyId,
        text: values.text.trim(),
        contact_status: status || ContactStatus.NO,
      })

      if (success) {
        toast.success('Yhteydenotto lisätty')
        onAddSuccess?.()
        actions.resetForm()
        setDialogOpen(false)
        setStatus(undefined)
      } else {
        toast.error('Tallennus epäonnistui')
      }
    } catch (error) {
      toast.error('Tuntematon virhe')
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lisää yhteydenotto</DialogTitle>
        </DialogHeader>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4 py-4">
              <div>
                <Label>Yhteystila</Label>
                <Select
                  value={status}
                  onValueChange={(val) => setStatus(val as ContactStatus)}
                >
                  <SelectTrigger className="w-full">
                    {status ? getLabel(status) : 'Valitse tila'}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ContactStatus.NO}>Ei</SelectItem>
                    <SelectItem value={ContactStatus.NO_TRIED}>
                      Ei - tavoiteltu
                    </SelectItem>
                    <SelectItem value={ContactStatus.YES_GOING}>
                      Kyllä - lähtee
                    </SelectItem>
                    <SelectItem value={ContactStatus.YES_NOT_GOING}>
                      Kyllä - ei lähde
                    </SelectItem>
                    <SelectItem value={ContactStatus.CALL_AGAIN}>
                      Soita uudestaan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="text">Yhteydenoton sisältö</Label>
                <Field
                  id="text"
                  name="text"
                  as={Textarea}
                  placeholder="Kuvaa yhteydenotto tähän..."
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Tallennetaan...' : 'Tallenna'}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

const getLabel = (status: ContactStatus) => {
  switch (status) {
    case ContactStatus.NO:
      return 'Ei'
    case ContactStatus.NO_TRIED:
      return 'Ei - tavoiteltu'
    case ContactStatus.YES_GOING:
      return 'Kyllä - lähtee'
    case ContactStatus.YES_NOT_GOING:
      return 'Kyllä - ei lähde'
    case ContactStatus.CALL_AGAIN:
      return 'Soita uudestaan'
    default:
      return 'Valitse tila'
  }
}

export default AddContactNoteDialog
