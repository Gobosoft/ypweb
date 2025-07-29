import React from 'react'
import { Field, Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardTitle, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import PendingSubmitButton from '../Buttons/PendingSubmitButton'
import FormErrorMessage from '../Forms/FormErrorMessage'
import i18n from 'src/i18n'
import exhibitionYearService from '../../services/AdminSettings/exhibitionYear'
import { displayResponseErrorMessage } from 'src/lib/utils'

const stylesForText =
  'block uppercase tracking-wide text-black-700 text-sm font-bold'

interface CreateExhibitionYearFormValues {
  year: number
  startDate: string
  endDate: string
}

const CreateExhibitionYearForm = () => {
  const handleSubmit = async (values: CreateExhibitionYearFormValues) => {
    try {
      const response = await exhibitionYearService.createExhibitionYear(values)
      if (response.status === 201) {
        toast.success(i18n.t('exhibitionYearCreated'))
      } else {
        toast.error(i18n.t('failedToCreateExhibitionYear'))
      }
    } catch (error: any) {
      displayResponseErrorMessage(error)
    }
  }

  return (
    <Card className="max-w-xl w-full mx-auto mt-6">
      <CardTitle className="text-center">
        {i18n.t('settingsView.createExhibitionYear')}
      </CardTitle>
      <Separator className="my-3" />
      <CardContent>
        <Formik
          initialValues={{
            year: new Date().getFullYear(),
            startDate: '',
            endDate: '',
          }}
          validationSchema={Yup.object().shape({
            year: Yup.number()
              .min(2000)
              .max(2100)
              .required(i18n.t('fieldValidation.required')),
            startDate: Yup.string().required(
              i18n.t('fieldValidation.required')
            ),
            endDate: Yup.string().required(i18n.t('fieldValidation.required')),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="flex flex-col gap-3">
              <Label className={stylesForText}>{i18n.t('year')}</Label>
              <Field
                type="number"
                name="year"
                as={Input}
                className="bg-white text-black rounded-lg px-3 py-2"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('year', e.target.value)
                }
              />
              <FormErrorMessage name="year" />

              <Label className={stylesForText}>{i18n.t('startDate')}</Label>
              <Field
                type="date"
                name="startDate"
                as={Input}
                className="bg-white text-black rounded-lg px-3 py-2"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('startDate', e.target.value)
                }
              />
              <FormErrorMessage name="startDate" />

              <Label className={stylesForText}>{i18n.t('endDate')}</Label>
              <Field
                type="date"
                name="endDate"
                as={Input}
                className="bg-white text-black rounded-lg px-3 py-2"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('endDate', e.target.value)
                }
              />
              <FormErrorMessage name="endDate" />

              <PendingSubmitButton
                isSubmitting={isSubmitting}
                buttonText={i18n.t('create')}
              />
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}

export default CreateExhibitionYearForm
