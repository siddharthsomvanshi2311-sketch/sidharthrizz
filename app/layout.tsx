import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Siddharthis - Full Stack Developer',
  description: 'Modern portfolio website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
