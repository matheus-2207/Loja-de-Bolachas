'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  const anoAtual = new Date().getFullYear()

  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-biscoito-900 text-biscoito-100 mt-auto">
      <div className="container-pagina py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Coluna 1: Identidade */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">🍪</span>
              <span className="font-display font-bold text-lg text-white">Loja da Madrinha</span>
            </div>
            <p className="text-sm text-biscoito-300 leading-relaxed">
              Bolachas artesanais feitas com carinho em Curitiba, PR.
              Ingredientes selecionados, sabor de casa.
            </p>
          </div>

          {/* Coluna 2: Navegação rápida */}
          <div>
            <h3 className="font-semibold text-white mb-3 font-display">Navegação</h3>
            <ul className="space-y-2 text-sm text-biscoito-300">
              <li><Link href="/" className="hover:text-white transition-colors">Início</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/carrinho" className="hover:text-white transition-colors">Carrinho</Link></li>
              <li><Link href="/checkout" className="hover:text-white transition-colors">Checkout</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h3 className="font-semibold text-white mb-3 font-display">Contato</h3>
            <ul className="space-y-2 text-sm text-biscoito-300">
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📍</span> Curitiba, Paraná
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📱</span> WhatsApp: (41) 99999-9999
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📸</span>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition-colors">
                  @lojadamadrinha
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha inferior */}
        <div className="mt-10 pt-6 border-t border-biscoito-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-biscoito-400">
          <p>© {anoAtual} Loja da Madrinha. Todos os direitos reservados.</p>
          <p>Feito com ❤️ e muito açúcar em Curitiba</p>
        </div>
      </div>
    </footer>
  )
}
