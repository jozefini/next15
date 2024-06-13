'use client'

import { createSession } from '@/lib/auth/session.server'
import { UserRole } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm } from 'react-hook-form'
import * as v from 'valibot'

const LoginSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  email: v.pipe(v.string(), v.nonEmpty(), v.email()),
})
type FormValues = v.InferOutput<typeof LoginSchema>

const css = {
  form: 'flex flex-col gap-y-2',
  input: 'border border-border inline-flex px-2 py-1 rounded outline-none',
  inputWithError: '!border-red-500',
  button: 'bg-primary text-white px-2 py-1 rounded',
}

export function Form() {
  const form = useForm<FormValues>({
    resolver: valibotResolver(LoginSchema),
  })
  const isEmailError = form.formState.errors?.email !== undefined
  const isNameError = form.formState.errors?.name !== undefined

  const signInHandler = async (data: FormValues) => {
    await createSession({
      id: 0,
      email: data.email,
      firstName: data.name,
      lastName: 'Last',
      role: UserRole.Admin,
    })
  }

  return (
    <form className={css.form} onSubmit={form.handleSubmit(signInHandler)}>
      <input
        className={cn(css.input, isNameError && css.inputWithError)}
        {...form.register('name')}
      />
      <input
        className={cn(css.input, isEmailError && css.inputWithError)}
        {...form.register('email')}
      />
      <button type="submit" className={css.button}>
        Sign In
      </button>
    </form>
  )
}
