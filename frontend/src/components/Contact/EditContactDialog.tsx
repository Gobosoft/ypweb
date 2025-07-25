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
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { Textarea } from 'src/components/ui/textarea'
import { Pencil, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { Formik, Form, Field } from 'formik'
import contactService from 'src/services/Contacts/contact'
import { Contact } from 'src/lib/types'

interface Props {
  contact: Contact
  companyId: string
  onSuccess?: () => void
  mode?: 'edit' | 'create'
}

const EditContactDialog = ({
  contact,
  companyId,
  onSuccess,
  mode = 'edit',
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const isEditMode = mode === 'edit'

  const initialValues = {
    name: isEditMode ? contact.name : '',
    email: isEditMode ? contact.email : '',
    phone: isEditMode ? contact.phone || '' : '',
    is_primary: isEditMode ? contact.is_primary : false,
    description: isEditMode ? contact.description || '' : '',
  }

  const handleSubmit = async (values: typeof initialValues, actions: any) => {
    try {
      const { is_primary, ...rest } = values
      const payload = {
        ...rest,
        is_primary: Boolean(is_primary),
      }

      await contactService.updateContact(companyId, payload)

      toast.success('Yhteyshenkilö tallennettu')
      onSuccess?.()
      setDialogOpen(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Tallennus epäonnistui')
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={isEditMode ? 'default' : 'outline'}>
          {isEditMode ? (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Muokkaa
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Lisää
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Muokkaa yhteyshenkilöä' : 'Lisää yhteyshenkilö'}
          </DialogTitle>
        </DialogHeader>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3 py-4">
              <div>
                <Label htmlFor="name">Nimi</Label>
                <Field id="name" name="name" as={Input} required />
              </div>
              <div>
                <Label htmlFor="email">Sähköposti</Label>
                <Field id="email" name="email" as={Input} required />
              </div>
              <div>
                <Label htmlFor="phone">Puhelin</Label>
                <Field id="phone" name="phone" as={Input} />
              </div>
              <div>
                <Label htmlFor="description">Kuvaus</Label>
                <Field id="description" name="description" as={Textarea} />
              </div>
              <div className="flex items-center gap-2">
                <Field type="checkbox" id="is_primary" name="is_primary" />
                <Label htmlFor="is_primary">Pääyhteyshenkilö</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Tallennetaan...'
                    : isEditMode
                      ? 'Tallenna'
                      : 'Lisää'}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default EditContactDialog
