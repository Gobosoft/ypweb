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
