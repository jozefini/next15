'use client'

import type { TUser } from '@/lib/types'
import { createContext, useContext } from 'react'

const AuthContext = createContext<TUser | null>(null)
const AuthProvider = AuthContext.Provider
export const useSession = () => {
  return useContext(AuthContext)
}
export default AuthProvider
