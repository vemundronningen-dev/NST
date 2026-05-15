import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NST — Nordic Surface Technology',
  description: 'OEM-kvalitet grävmaskins-tillbehör. Gripar, skopor och sopborstar för professionellt bruk.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  )
}
