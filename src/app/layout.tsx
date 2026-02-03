import type { Metadata } from 'next'
import { AppStackProvider } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'PT & Pain Tracker',
  description:
    'Physical therapy exercise tracking and pain logging for patients and providers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppStackProvider>{children}</AppStackProvider>
      </body>
    </html>
  )
}
