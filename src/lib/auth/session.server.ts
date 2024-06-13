'use server'

import { DAY_IN_MS } from '@/lib/constants'
import type { TUser } from '@/lib/types'
import { getEnv, isProdMode } from '@/lib/utils'
import type { JWTPayload } from 'jose'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// Types

type TPayload = {
  user: TUser
  expires: string
}

// Constants

const SECRET_KEY = new TextEncoder().encode(getEnv('JWT_SECRET_KEY'))
const ISSUER = getEnv('NEXT_PUBLIC_APP_URL')
const EXPIRATION = '1day'
const ALGORITHM = 'HS256'
const COOKIE_NAME = 'session'
const COOKIE_EXPIRES = DAY_IN_MS
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProdMode,
  sameSite: 'strict',
  path: '/',
} as const

export async function encrypt(payload?: JWTPayload) {
  if (!payload) {
    return null
  }
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(ISSUER)
    .setExpirationTime(EXPIRATION)
    .sign(SECRET_KEY)
}

export async function decrypt(cookieToken?: string) {
  if (!cookieToken) {
    return null
  }
  try {
    const { payload } = await jwtVerify<TPayload>(cookieToken, SECRET_KEY, {
      issuer: ISSUER,
      audience: ISSUER,
      algorithms: [ALGORITHM],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function createSession(user?: TUser) {
  // 1. Encrypt the session
  const expires = new Date(Date.now() + COOKIE_EXPIRES)
  const session = await encrypt({ expires, user })
  if (!session) {
    return { user: null }
  }

  // 2. Set the session cookie
  cookies().set(COOKIE_NAME, session, {
    ...COOKIE_OPTIONS,
    expires,
  })

  // 3. Return the session user
  return { user }
}

export async function getSession() {
  // 1. Get the session cookie
  const cookie = cookies().get(COOKIE_NAME)?.value
  if (!cookie) {
    return { user: null }
  }

  // 2. Decrypt the session cookie
  const session = await decrypt(cookie)
  if (!session || !session.user || new Date(session.expires) < new Date()) {
    cookies().delete(COOKIE_NAME)
    return { user: null }
  }

  // 3. Return the session user
  return { user: session.user }
}

export async function deleteSession() {
  // 1. Delete the session cookie
  cookies().delete(COOKIE_NAME)

  // 2. Return the session user
  return { user: null }
}
