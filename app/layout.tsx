import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SignalAI — Conference Knowledge Multiplier',
  description: 'Turn conference chaos into career capital',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white">
        {children}
      </body>
    </html>
  )
}