import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Loja da Madrinha 🍪 — Bolachas Artesanais',
  description: 'Bolachas artesanais feitas com amor. Peça online e receba fresquinhas!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1 fade-in">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
