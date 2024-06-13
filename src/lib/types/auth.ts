import type { UserRole } from '@/lib/enums'

export type TUser = {
  id: string | number
  firstName: string
  lastName: string
  email: string
  role: UserRole
}
