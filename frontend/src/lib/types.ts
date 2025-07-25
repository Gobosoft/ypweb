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

export enum ContactStatus {
  NO = 'no',
  NO_TRIED = 'no_tried',
  YES_GOING = 'yes_going',
  YES_NOT_GOING = 'yes_not_going',
  CALL_AGAIN = 'call_again',
}

export interface LatestContactLog {
  text: string
  updated_at: string
  contact_status?: ContactStatus
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  is_primary: boolean
  description: string
}

export interface CompanyDetail {
  id: string
  name: string
  display_name?: string
  business_id: string
  booth_size?: string
  coordinator_name?: string
  contact_received: boolean
  contract_returned_date?: string
  arrival_info_date?: string
  invoice_sent_date?: string
  invoice_paid_date?: string
  special_requests?: string
  material_returned_date?: string
  first_day_booth?: string
  second_day_booth?: string
  contacts: Contact[]
  latest_contact_log?: LatestContactLog
}

export type Order = {
  id: string
  order_date: string
  order_type: string
  status: string
  attendance_confirmed: boolean
  portal_uuid: string
}

export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export enum OrderType {
  STAND = 'STAND',
  OTHER = 'OTHER',
}

export enum MaterialType {
  LOGO = 'LOGO',
  AD = 'AD',
  OTHER = 'OTHER',
}

export type Product = {
  id: string
  name: string
  price: number
  description?: string
  is_active: boolean
  exhibition_year_id: string
}

export interface OrderRow {
  id: string
  order_id: string
  product_id: string
  amount: number
  unit_price: number
}

export type Material = {
  id: string
  type: string
  file_name: string
  file_path: string
  returned_date: string
}

export type ArrivalInfo = {
  id: string
  lunch_count: number
  dietary_restrictions: string
  cocktail_count: number
  goods_sending: string
  returned_date: string
}

export type Contract = {
  id: string
  file_name: string
  file_path: string
  is_returned: boolean
  is_signed: boolean
  returned_date: string
}

export type Invoice = {
  id: string
  order_id: string
  sum: number
  invoice_date: string
  due_date: string
  is_sent: boolean
  is_paid: boolean
  reference: string
  special_info?: string | null
}
