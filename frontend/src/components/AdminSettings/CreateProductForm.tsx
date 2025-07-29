import { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input } from 'src/components/ui/input'
import { Textarea } from 'src/components/ui/textarea'
import { Button } from 'src/components/ui/button'
import { Checkbox } from 'src/components/ui/checkbox'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from 'src/components/ui/select'
import FormErrorMessage from '../Forms/FormErrorMessage'
import exhibitionYearService from 'src/services/AdminSettings/exhibitionYear'
import { ExhibitionYear } from 'src/lib/types'
import i18n from 'src/i18n'
import productsService from 'src/services/Products/products'

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  price: Yup.number().positive('Must be positive').required('Required'),
  description: Yup.string().optional(),
  is_active: Yup.boolean().required(),
  exhibition_year_id: Yup.string()
    .uuid('Must be a valid UUID')
    .required('Required'),
})

const CreateProductForm = () => {
  const [exhibitionYears, setExhibitionYears] = useState<ExhibitionYear[]>([])

  useEffect(() => {
    const fetchExhibitionYears = async () => {
      const res = await exhibitionYearService.fetchExhibitionYears()
      setExhibitionYears(res)
    }
    fetchExhibitionYears()
  }, [])

  return (
    <Formik
      initialValues={{
        name: '',
        price: 0,
        description: '',
        is_active: true,
        exhibition_year_id: '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        await productsService.createProduct(values)
        resetForm()
      }}
    >
      {({ values, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label htmlFor="name">Nimi</label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormErrorMessage name="name" />
          </div>

          <div>
            <label htmlFor="price">Hinta</label>
            <Input
              id="price"
              name="price"
              type="number"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormErrorMessage name="price" />
          </div>

          <div>
            <label htmlFor="description">Kuvaus</label>
            <Textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormErrorMessage name="description" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={values.is_active}
              onCheckedChange={(checked: boolean) =>
                setFieldValue('is_active', checked)
              }
            />
            <label htmlFor="is_active">Aktiivinen</label>
          </div>

          <div>
            <label htmlFor="exhibition_year_id">Messuvuosi</label>
            <Select
              onValueChange={(val) => setFieldValue('exhibition_year_id', val)}
              value={values.exhibition_year_id}
            >
              <SelectTrigger id="exhibition_year_id">
                <SelectValue placeholder="Valitse messuvuosi" />
              </SelectTrigger>
              <SelectContent>
                {exhibitionYears.map((year) => (
                  <SelectItem key={year.id} value={year.id.toString()}>
                    {year.year} {year.is_active && i18n.t('isActive')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormErrorMessage name="exhibition_year_id" />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Lähetetään...' : 'Luo uusi tuote'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default CreateProductForm
