import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartProvider } from '@/context/CartContext'

export const metadata: Metadata = {
  title: {
    default: 'Loja da Madrinha 🍪 — Bolachas Artesanais em Curitiba',
    template: '%s | Loja da Madrinha',
  },
  description:
    'Bolachas artesanais feitas com amor em Curitiba. Peça online e receba fresquinhas na sua porta!',
  keywords: ['bolachas artesanais', 'biscoitos', 'curitiba', 'encomenda', 'presente'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Loja da Madrinha',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          {/* Cabeçalho global com navegação */}
          <Header />

          {/* Conteúdo principal da página */}
          <main className="flex-1 fade-in">
            {children}
          </main>

          {/* Rodapé global */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
