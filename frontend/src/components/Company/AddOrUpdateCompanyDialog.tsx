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
import { Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { Formik, Form, Field } from 'formik'
import i18n from 'src/i18n'

const NewCompanyDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const initialValues = {
    name: '',
    businessId: '',
    boothSize: '',
    specialRequests: '',
    status: '',
    displayName: '',
    coordinatorId: '',
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      console.log('Submitting company:', values)
      toast.success('Yritys lisätty!')
      setDialogOpen(false)
    } catch (error) {
      toast.error('Virhe yrityksen luonnissa')
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />{' '}
          {i18n.t('addNewCompany') || 'Uusi yritys'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {i18n.t('addNewCompany') || 'Lisää uusi yritys'}
          </DialogTitle>
        </DialogHeader>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3 py-4">
              <div>
                <Label htmlFor="name">
                  {i18n.t('companyName') || 'Yrityksen nimi'}
                </Label>
                <Field id="name" name="name" as={Input} required />
              </div>
              <div>
                <Label htmlFor="businessId">Y-tunnus</Label>
                <Field id="businessId" name="businessId" as={Input} />
              </div>
              <div>
                <Label htmlFor="boothSize">Ständin koko</Label>
                <Field id="boothSize" name="boothSize" as={Input} />
              </div>
              <div>
                <Label htmlFor="specialRequests">Toiveet</Label>
                <Field
                  id="specialRequests"
                  name="specialRequests"
                  as={Textarea}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Field id="status" name="status" as={Input} />
              </div>
              <div>
                <Label htmlFor="displayName">Näyttönimi</Label>
                <Field id="displayName" name="displayName" as={Input} />
              </div>
              <div>
                <Label htmlFor="coordinator">Asiakaskoordinaattori</Label>
                <Field id="coordinator" name="coordinator" as={Input} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? i18n.t('saving') || 'Tallennetaan...'
                    : i18n.t('save') || 'Tallenna'}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default NewCompanyDialog
