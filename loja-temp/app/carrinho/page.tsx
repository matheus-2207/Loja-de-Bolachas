'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function PaginaCarrinho() {
  const { items, atualizarQuantidade, removerDoCarrinho, totalItens, valorTotal } = useCart()

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  }

  return (
    <div className="container-pagina py-12 md:py-20">
      <h1 className="font-display font-bold text-4xl text-biscoito-900 mb-8">
        Seu Carrinho 🛒
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-biscoito-100 shadow-sm">
          <span className="text-7xl block mb-6 opacity-80" aria-hidden="true">🛒</span>
          <h2 className="font-display font-semibold text-2xl text-biscoito-800 mb-3">
            O carrinho está vazio
          </h2>
          <p className="text-biscoito-600 mb-8">
            Você ainda não adicionou nenhuma de nossas delícias.
          </p>
          <Link href="/catalogo" className="btn-primario text-lg px-8 py-3">
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <section className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 bg-biscoito-100 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                  🍪
                </div>
                
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h3 className="font-semibold text-biscoito-900 text-lg">{item.nome}</h3>
                  <p className="text-sm text-biscoito-500">{formatarPreco(item.preco)} a unidade</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-biscoito-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                      className="w-10 h-10 flex items-center justify-center text-biscoito-600 hover:bg-biscoito-50 transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-medium text-biscoito-900">
                      {item.quantidade}
                    </span>
                    <button 
                      onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                      className="w-10 h-10 flex items-center justify-center text-biscoito-600 hover:bg-biscoito-50 transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="w-24 text-right">
                    <span className="preco block">{formatarPreco(item.preco * item.quantidade)}</span>
                  </div>

                  <button 
                    onClick={() => removerDoCarrinho(item.id)}
                    className="p-2 text-biscoito-300 hover:text-red-500 transition-colors ml-2"
                    aria-label="Remover item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Resumo */}
          <section className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display font-semibold text-2xl text-biscoito-900 mb-6 border-b border-biscoito-100 pb-4">
                Resumo do Pedido
              </h2>
              
              <div className="space-y-4 mb-6 text-biscoito-700">
                <div className="flex justify-between items-center">
                  <span>Itens ({totalItens})</span>
                  <span className="font-medium text-biscoito-900">{formatarPreco(valorTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Frete</span>
                  <span className="text-sm">Calculado na próxima etapa</span>
                </div>
                <div className="pt-4 border-t border-biscoito-100 flex justify-between items-center">
                  <span className="font-bold text-lg text-biscoito-900">Total</span>
                  <span className="preco text-2xl">{formatarPreco(valorTotal)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primario w-full text-center text-lg py-4 mb-4 block">
                Finalizar Compra
              </Link>
              
              <Link href="/catalogo" className="block text-center text-sm text-biscoito-600 hover:text-biscoito-800 transition-colors">
                ← Continuar comprando
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
