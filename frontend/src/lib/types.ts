export interface CurrentUserState {
  userData: {
    email: string
    phone?: string
    language: string
  }
}

export type User = {
  id: string
  email: string
  created_at?: Date
  updated_at?: Date
}

export interface ExhibitionYear {
  id: number
  year: number
  start_date: string
  end_date: string
  is_active: boolean
}

export enum CompanyStatus {
  RESERVED = 'reserved',
  UNRESERVED = 'unreserved',
  SIGNED = 'signed',
  ORDERED = 'ordered',
  CHARGED = 'charged',
  PAID = 'paid',
}

export interface Company {
  id: string
  name: string
  business_id: string
  booth_size?: string
  special_requests?: string
  status: CompanyStatus
  display_name?: string
  project_id: string
  coordinator_id?: string
}
