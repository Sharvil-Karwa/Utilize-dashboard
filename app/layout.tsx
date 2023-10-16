import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Footer from '@/components/footer'
import prismadb from '@/lib/prismadb'
import { ModalProvider } from '@/providers/modal-provider'
import { ToastProvider } from '@/providers/toast-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Order Manager',
  description: 'Order Manager: made by Sharvil Karwa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { 


  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToastProvider />
          <ModalProvider />
          {children}    
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
