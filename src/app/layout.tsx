/** eslint-disable react/no-children-prop */
import '@/assets/styles.css'
import AuthProvider from '@/lib/auth'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

const geistSans = localFont({
  src: '../assets/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={geistSans.variable}>
        <AuthProvider value={null}>
          <div className="min-h-screen bg-gray-100">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}
