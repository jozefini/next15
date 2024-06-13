// import { Form as SignInForm } from '@/app/sign-in/form'
// import { getUser } from '@/lib/api'

const css = {
  wrapper:
    'min-h-screen grid grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20',
  main: 'row-start-2 flex flex-col items-center gap-8 sm:items-start',
} as const

export default async function Home() {
  // const user = await getUser()

  return (
    <div className={css.wrapper}>
      <main className={css.main}>
        {/* {!user ? (
          <SignInForm />
        ) : (
          <>
            <h1 className="text-4xl font-bold">Welcome {user.firstName},</h1>
          </>
        )} */}
        Hello World
        <br />
      </main>
    </div>
  )
}
