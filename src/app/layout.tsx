import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Eazylink - Plateforme de collaboration',
  description: 'Eazylink est une plateforme qui simplifie la collaboration et la gestion de projets.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full bg-gray-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`h-full ${inter.className}`}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
