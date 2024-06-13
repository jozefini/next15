type TEnvVars = 'JWT_SECRET_KEY' | 'NEXT_PUBLIC_APP_URL'

export const getEnv = (env: TEnvVars, isImportant = true): string => {
  const value = process.env[env] || ''
  if (typeof value === 'string') {
    return value
  }
  if (isImportant) {
    throw new Error(`Environment variable ${env} is missing`)
  }
  return ''
}

export const isDevMode = process.env.NODE_ENV === 'development'
export const isProdMode = process.env.NODE_ENV === 'production'
