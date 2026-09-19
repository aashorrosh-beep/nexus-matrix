import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ALBS | Toys, Games & Novelties',
  description: 'Spoke-Wheel UI Active',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
