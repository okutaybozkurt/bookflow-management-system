import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KitapÜssü - Türkiye\'nin Kitap Mağazası',
  description: 'KitapÜssü ile milyonlarca kitaba ulaşın. Roman, bilim, ansiklopedi ve daha fazlası en uygun fiyatlarla.',
  keywords: ['kitap', 'kitapçı', 'e-kitap', 'roman', 'ansiklopedi', 'KitapÜssü'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
