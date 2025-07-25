import axiosInstance from 'src/axiosConfig'
import { ContactStatus } from 'src/lib/types'

const baseUrl = '/api/contacts'

export interface AddContactNotePayload {
  company_id: string
  text: string
  contact_status: ContactStatus
}

interface ContactUpdatePayload {
  name: string
  email: string
  phone?: string
  description?: string
  is_primary: boolean
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

const updateContact = async (
  companyId: string,
  payload: ContactUpdatePayload
) => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/company/${companyId}`,
      payload
    )
    return response.data
  } catch (error: any) {
    console.error('Failed to update contact:', error)
    throw error
  }
}

const deleteContact = async (companyId: string, contactId: string) => {
  try {
    await axiosInstance.delete(
      `${baseUrl}/company/${companyId}/contact/${contactId}`
    )
  } catch (error: any) {
    console.error('Failed to delete contact:', error)
    throw error
  }
}

export default {
  addCompanyContactNote,
  updateContact,
  deleteContact,
}
