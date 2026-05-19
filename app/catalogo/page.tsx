import type { Metadata } from 'next'
import Link from 'next/link'
import { CardProduto } from '@/components/card-produto'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Catálogo de Bolachas',
  description: 'Veja todos os nossos sabores de bolachas artesanais. Manteiga, chocolate, limão e muito mais!',
}

export default async function PaginaCatalogo({
  searchParams,
}: {
  searchParams: { categoria?: string }
}) {
  // Categorias disponíveis - podemos buscar dinamicamente depois
  const categorias = ['Todos', 'Clássicas', 'Chocolate', 'Frutas', 'Especiais', 'Caixas']
  
  // Buscar produtos do banco
  const todosProdutos = await prisma.produto.findMany({
    where: { 
      ativo: true,
      ...(searchParams.categoria && searchParams.categoria !== 'Todos' ? { categoria: searchParams.categoria } : {})
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container-pagina py-10">

      {/* Cabeçalho da página */}
      <header className="mb-8">
        <h1 className="font-display font-bold text-4xl text-biscoito-900 mb-2">
          Catálogo de Bolachas 🍪
        </h1>
        <p className="text-biscoito-500 text-lg">
          {todosProdutos.length} produtos disponíveis
        </p>
      </header>

      {/* Filtros de categoria */}
      <nav className="mb-8" aria-label="Filtrar por categoria">
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => {
            const isActive = searchParams.categoria === cat || (!searchParams.categoria && cat === 'Todos')
            return (
              <Link
                href={cat === 'Todos' ? '/catalogo' : `/catalogo?categoria=${encodeURIComponent(cat)}`}
                key={cat}
                id={`filtro-${cat.toLowerCase()}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-biscoito-500 text-white shadow-md'
                    : 'bg-white text-biscoito-600 border border-biscoito-200 hover:bg-biscoito-50'
                }`}
                aria-pressed={isActive}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Grid de produtos */}
      <section aria-label="Lista de produtos">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {todosProdutos.map((produto) => (
            <CardProduto 
              key={produto.id} 
              produto={{ 
                ...produto, 
                preco: produto.preco.toNumber(),
                estoque: produto.estoque 
              }} 
            />
          ))}
        </div>
      </section>

      {/* Informação de pedido mínimo */}
      <aside className="mt-10 p-4 bg-creme-100 border border-creme-300 rounded-xl text-sm text-biscoito-700">
        <strong>💡 Dica:</strong> Faça seu pedido pelo WhatsApp para encomendas personalizadas e bolachas decoradas especiais!
      </aside>
    </div>
  )
}
