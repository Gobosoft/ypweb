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
import { Company } from 'src/lib/types'
import companyService from 'src/services/Companies/companyService'

interface Props {
  companies: Company[]
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>
}

interface CompanyCreate {
  name: string
  business_id: string
  display_name?: string
  booth_size?: string
  special_requests?: string
  coordinator_name?: string
}

const AddOrUpdateCompanyDialog = ({ companies, setCompanies }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const initialValues = {
    name: '',
    business_id: '',
    display_name: '',
    booth_size: '',
    special_requests: '',
    coordinator_name: '',
  }

  const handleSubmit = async (values: typeof initialValues, actions: any) => {
    const trimmedCoordinator = values.coordinator_name.trim()

    const payload: CompanyCreate = {
      name: values.name.trim(),
      business_id: values.business_id.trim(),
      display_name: values.display_name?.trim() || values.name.trim(),
      booth_size: values.booth_size?.trim(),
      special_requests: values.special_requests?.trim(),
      coordinator_name: trimmedCoordinator || undefined,
    }

    try {
      const newCompany = await companyService.createCompany(payload)

      if (newCompany) {
        toast.success(i18n.t('successGeneric'))
        setCompanies((prev) => [...prev, newCompany])
        actions.resetForm()
        setDialogOpen(false)
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || i18n.t('errorGeneric'))
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
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
                <Label htmlFor="business_id">Y-tunnus</Label>
                <Field
                  id="business_id"
                  name="business_id"
                  as={Input}
                  required
                />
              </div>
              <div>
                <Label htmlFor="display_name">Näyttönimi</Label>
                <Field id="display_name" name="display_name" as={Input} />
              </div>
              <div>
                <Label htmlFor="booth_size">Ständin koko</Label>
                <Field id="booth_size" name="booth_size" as={Input} />
              </div>
              <div>
                <Label htmlFor="special_requests">Toiveet</Label>
                <Field
                  id="special_requests"
                  name="special_requests"
                  as={Textarea}
                />
              </div>
              <div>
                <Label htmlFor="coordinator_name">Asiakaskoordinaattori</Label>
                <Field
                  id="coordinator_name"
                  name="coordinator_name"
                  as={Input}
                />
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

export default AddOrUpdateCompanyDialog
