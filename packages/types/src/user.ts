export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  supabaseId: string
  createdAt: string
  updatedAt: string
}