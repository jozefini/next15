'use server'

import { deleteSession, getSession } from '@/lib/auth/session.server'
import type { TUser } from '@/lib/types'
import { fakeRequest } from '@/lib/utils'
import { cache } from 'react'

export const getUser = cache(async () => {
  const { user } = await getSession()
  if (!user) {
    return null
  }

  await deleteSession()
  return fakeRequest<TUser | null>(
    null,
    3000 // delay
  )
})
