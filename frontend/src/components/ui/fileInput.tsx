import React, { ChangeEvent, useRef, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import i18n from 'src/i18n'
import { Button } from '../ui/button'

interface CustomFileInputProps {
  name: string
  required?: boolean
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({
  name,
  required,
}) => {
  const { setFieldValue, setFieldTouched } = useFormikContext()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string>('')

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFieldValue(name, file)
      setFileName(file.name)
      setFieldTouched(name, true, false)
    } else {
      setFileName('')
      setFieldValue(name, '')
      setFieldTouched(name, true, false)
    }
  }

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*,.pdf"
      />
      <Button type="button" onClick={handleButtonClick}>
        {i18n.t('selectFile')}
      </Button>
      <span> {fileName ? fileName : i18n.t('noFileChosen')}</span>
    </div>
  )
}

export default CustomFileInput
