'use client'

import { Produto, useCart } from '@/context/CartContext'

interface CardProdutoProps {
  produto: Produto
}

export function CardProduto({ produto }: CardProdutoProps) {
  const { adicionarAoCarrinho } = useCart()

  const handleComprar = () => {
    adicionarAoCarrinho(produto)
    // Opcional: Feedback visual poderia ser adicionado aqui (um toast, por exemplo)
  }

  return (
    <article className="card flex flex-col group h-full">
      <div className="relative overflow-hidden bg-biscoito-100 aspect-square flex items-center justify-center text-6xl">
        🍪
        <div className="absolute inset-0 bg-biscoito-500/0 group-hover:bg-biscoito-500/10 transition-all duration-300" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-biscoito-900 text-xl mb-2 group-hover:text-biscoito-600 transition-colors">
          {produto.nome}
        </h3>
        <p className="text-sm text-biscoito-500 line-clamp-2 mb-4 flex-1">
          {produto.descricao}
        </p>
        <div className="flex items-center justify-between">
          <span className="preco text-lg">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
          </span>
          <button 
            onClick={handleComprar}
            className="btn-primario py-2 px-4 text-sm hover:-translate-y-1"
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  )
}
