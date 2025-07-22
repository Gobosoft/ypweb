export interface CurrentUserState {
  userData: {
    name: string
    email: string
    role: UserRole
  }
}

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  created_at?: Date
  updated_at?: Date
}

export enum UserRole {
  IT = 'IT',
  FINANCE = 'FINANCE',
  AK = 'AK',
  PP = 'PP',
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
  exhibition_year_id: string
  coordinator_id?: string
}
