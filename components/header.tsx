'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

// Links de navegação principal
const navLinks = [
  { href: '/',          label: 'Início' },
  { href: '/catalogo',  label: 'Catálogo' },
  { href: '/carrinho',  label: 'Carrinho' },
]

export function Header() {
  const pathname = usePathname()
  const [menuAberto, setMenuAberto] = useState(false)
  const { totalItens } = useCart()

  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-biscoito-100 shadow-sm">
      <div className="container-pagina">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl" aria-hidden="true">🍪</span>
            <div>
              <span className="font-display font-bold text-xl text-biscoito-700 group-hover:text-biscoito-500 transition-colors">
                Loja da Madrinha
              </span>
              <span className="hidden sm:block text-xs text-biscoito-400 -mt-1">
                Bolachas artesanais · Curitiba
              </span>
            </div>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-biscoito-100 text-biscoito-700'
                    : 'text-biscoito-600 hover:bg-biscoito-50 hover:text-biscoito-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Ícone do carrinho + menu mobile */}
          <div className="flex items-center gap-3">
            <Link
              href="/carrinho"
              id="btn-carrinho-header"
              className="relative p-2 rounded-xl text-biscoito-600 hover:bg-biscoito-50 hover:text-biscoito-700 transition-all"
              aria-label="Ver carrinho"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Badge de quantidade com estado global */}
              {totalItens > 0 && (
                <span className="absolute -top-1 -right-1 bg-biscoito-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItens}
                </span>
              )}
            </Link>

            {/* Botão menu hamburger mobile */}
            <button
              id="btn-menu-mobile"
              className="md:hidden p-2 rounded-xl text-biscoito-600 hover:bg-biscoito-50 transition-all"
              onClick={() => setMenuAberto(!menuAberto)}
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuAberto}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuAberto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile dropdown */}
        {menuAberto && (
          <nav className="md:hidden py-3 border-t border-biscoito-100 fade-in" aria-label="Navegação mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-biscoito-100 text-biscoito-700'
                    : 'text-biscoito-600 hover:bg-biscoito-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
