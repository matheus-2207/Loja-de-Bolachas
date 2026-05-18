'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export function Header() {
  const { totalItens } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-biscoito-100 shadow-sm">
      <div className="container-pagina">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl" aria-hidden="true">🍪</span>
            <div>
              <span className="font-display font-bold text-xl text-biscoito-700 group-hover:text-biscoito-500 transition-colors">
                Loja da Madrinha
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/catalogo" className="text-biscoito-600 hover:text-biscoito-800 font-medium transition-colors">
              Catálogo
            </Link>
            
            <Link href="/carrinho" className="relative p-2 text-biscoito-600 hover:text-biscoito-800 transition-colors" aria-label="Ir para o carrinho">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItens > 0 && (
                <span className="absolute -top-1 -right-1 bg-biscoito-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {totalItens}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
