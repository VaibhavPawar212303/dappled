import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/providers/toast-providers'
import { LandingNavbar } from './_components/landing-navbar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TheDappled',
  description: 'Tutorial web app for learning new tech stack',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* ✅ Navbar is here, managing the auth buttons */}
          <LandingNavbar /> 
          <ToastProvider />
          <main className="pt-20 h-full">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}