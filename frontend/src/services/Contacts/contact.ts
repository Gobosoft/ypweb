import axiosInstance from 'src/axiosConfig'
import { ContactStatus } from 'src/lib/types'

const baseUrl = '/api/contacts'

export interface AddContactNotePayload {
  company_id: string
  text: string
  contact_status: ContactStatus
}

const addCompanyContactNote = async (
  payload: AddContactNotePayload
): Promise<boolean> => {
  try {
    await axiosInstance.post(`${baseUrl}/company-contact-note`, payload)
    return true
  } catch (error) {
    console.error('Error adding comment', error)
    return false
  }
}

export default {
  addCompanyContactNote,
}
