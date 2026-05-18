'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

// Tipo do produto (será expandido conforme Prisma)
interface Produto {
  id: string
  nome: string
  descricao?: string | null
  preco: number | string
  imagem?: string | null
  estoque: number
}

interface CardProdutoProps {
  produto: Produto
}

// Formata valor para Real Brasileiro
function formatarPreco(valor: number | string): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valor))
}

export function CardProduto({ produto }: CardProdutoProps) {
  const temEstoque = produto.estoque > 0
  const { adicionarAoCarrinho } = useCart()

  const handleAdicionar = (e: React.MouseEvent) => {
    e.preventDefault()
    if (temEstoque) {
      adicionarAoCarrinho({
        ...produto,
        preco: Number(produto.preco)
      })
    }
  }

  const imagemSrc = produto.imagem || '/placeholder-bolacha.jpg'

  return (
    <article
      className="card group cursor-pointer flex flex-col"
      aria-label={`Produto: ${produto.nome}`}
    >
      {/* Imagem do produto */}
      <div className="relative overflow-hidden bg-biscoito-100 aspect-square">
        {produto.imagem ? (
          <img 
            src={produto.imagem} 
            alt={`Foto de ${produto.nome}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-biscoito-100 to-creme-200">
            🍪
          </div>
        )}

        {/* Badge sem estoque */}
        {!temEstoque && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-biscoito-700 font-semibold text-sm px-3 py-1 rounded-full">
              Esgotado
            </span>
          </div>
        )}

        {/* Efeito hover */}
        <div className="absolute inset-0 bg-biscoito-500/0 group-hover:bg-biscoito-500/5 transition-all duration-300" />
      </div>

      {/* Informações do produto */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-display font-semibold text-biscoito-900 text-lg leading-tight group-hover:text-biscoito-600 transition-colors">
          {produto.nome}
        </h3>

        {produto.descricao && (
          <p className="text-sm text-biscoito-500 leading-relaxed line-clamp-2">
            {produto.descricao}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-3">
          {/* Preço */}
          <span className="preco text-xl">
            {formatarPreco(produto.preco)}
          </span>

          {/* Botão de adicionar */}
          <button
            id={`btn-adicionar-${produto.id}`}
            onClick={handleAdicionar}
            disabled={!temEstoque}
            className={`btn-primario py-2 px-4 text-sm ${
              !temEstoque ? 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-md' : ''
            }`}
            aria-label={temEstoque ? `Adicionar ${produto.nome} ao carrinho` : 'Produto esgotado'}
          >
            {temEstoque ? (
              <>
                <span aria-hidden="true">+</span> Adicionar
              </>
            ) : (
              'Esgotado'
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
