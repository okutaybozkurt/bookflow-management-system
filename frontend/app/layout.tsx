import type { Metadata } from 'next'
// Inter yazı tipi npm paketiyle projeyle birlikte gelir; internet gerekmez.
import '@fontsource-variable/inter'
import './globals.css'

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
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
