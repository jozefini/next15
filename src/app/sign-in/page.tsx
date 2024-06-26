import { Form as SignInForm } from './form'

const css = {
  wrapper:
    'min-h-screen grid grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20',
  main: 'row-start-2 flex flex-col items-center gap-8 sm:items-start',
} as const

export default function Page() {
  return (
    <div className={css.wrapper}>
      <main className={css.main}>
        <h1>Sign In</h1>
        <SignInForm />
      </main>
    </div>
  )
}
