import type { Metadata } from 'next'
import Link from 'next/link'
import { CardProduto } from '@/components/card-produto'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Bolachas Artesanais em Curitiba — Loja da Madrinha',
  description: 'Descubra nossas bolachas artesanais feitas com amor. Peça online e receba fresquinhas!',
}

export default async function PaginaHome() {
  const produtosDestaque = await prisma.produto.findMany({
    where: { ativo: true },
    orderBy: { createdAt: 'desc' },
    take: 4
  })

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section
        id="hero"
        className="relative overflow-hidden bg-gradient-to-br from-biscoito-50 via-creme-100 to-biscoito-100 py-20 md:py-28"
        aria-labelledby="titulo-hero"
      >
        {/* Decoração de fundo */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <span className="absolute top-10 left-10 text-8xl opacity-10 rotate-12">🍪</span>
          <span className="absolute bottom-10 right-10 text-9xl opacity-10 -rotate-12">🍪</span>
          <span className="absolute top-1/2 left-1/4 text-6xl opacity-5 rotate-45">🍪</span>
        </div>

        <div className="container-pagina relative z-10 text-center">
          <span className="inline-block bg-biscoito-100 text-biscoito-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🇧🇷 Feitas com amor em Curitiba
          </span>

          <h1
            id="titulo-hero"
            className="font-display font-bold text-4xl md:text-6xl text-biscoito-900 mb-6 leading-tight"
          >
            Bolachas artesanais{' '}
            <span className="text-biscoito-500">da Madrinha</span> 🍪
          </h1>

          <p className="text-lg md:text-xl text-biscoito-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Receitas tradicionais, ingredientes selecionados e muito carinho em cada fornada.
            Entregamos em toda Curitiba!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo" id="btn-ver-catalogo" className="btn-primario text-base px-8 py-4">
              Ver Catálogo Completo
            </Link>
            <Link href="#destaques" id="btn-ver-destaques" className="btn-secundario text-base px-8 py-4">
              Ver Destaques
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== DIFERENCIAIS ===================== */}
      <section id="diferenciais" className="py-16 bg-white" aria-labelledby="titulo-diferenciais">
        <div className="container-pagina">
          <h2 id="titulo-diferenciais" className="sr-only">Nossos diferenciais</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: '🌾', titulo: 'Ingredientes naturais', texto: 'Sem conservantes ou corantes artificiais' },
              { emoji: '🏡', titulo: 'Feitas em casa', texto: 'Receitas tradicionais de família' },
              { emoji: '🚚', titulo: 'Entrega em Curitiba', texto: 'Frete calculado pelo seu CEP' },
              { emoji: '💳', titulo: 'PIX ou cartão', texto: 'Pagamento seguro via Mercado Pago' },
            ].map((item) => (
              <div
                key={item.titulo}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-biscoito-50 hover:bg-biscoito-100 transition-colors duration-200"
              >
                <span className="text-4xl mb-3" aria-hidden="true">{item.emoji}</span>
                <h3 className="font-semibold text-biscoito-800 mb-1">{item.titulo}</h3>
                <p className="text-sm text-biscoito-500">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PRODUTOS EM DESTAQUE ===================== */}
      <section id="destaques" className="py-16" aria-labelledby="titulo-destaques">
        <div className="container-pagina">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="titulo-destaques" className="font-display font-bold text-3xl text-biscoito-900">
                Destaques da semana
              </h2>
              <p className="text-biscoito-500 mt-1">Os queridinhos das nossas clientes</p>
            </div>
            <Link href="/catalogo" className="btn-secundario hidden sm:inline-flex py-2 px-5 text-sm">
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtosDestaque.map((produto) => (
              <CardProduto key={produto.id} produto={{ ...produto, preco: produto.preco.toNumber() }} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/catalogo" className="btn-secundario">
              Ver catálogo completo →
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section
        id="cta-final"
        className="py-16 bg-gradient-to-br from-biscoito-500 to-biscoito-700 text-white"
        aria-labelledby="titulo-cta"
      >
        <div className="container-pagina text-center">
          <h2 id="titulo-cta" className="font-display font-bold text-3xl md:text-4xl mb-4">
            Quer fazer uma encomenda especial? 🎁
          </h2>
          <p className="text-biscoito-100 text-lg max-w-xl mx-auto mb-8">
            Bolachas decoradas para aniversários, casamentos e eventos. Entre em contato!
          </p>
          <a
            href="https://wa.me/5541999999999"
            id="btn-whatsapp-cta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-biscoito-700 font-bold px-8 py-4 rounded-xl
                       hover:bg-biscoito-50 transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            <span className="text-xl" aria-hidden="true">💬</span>
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
