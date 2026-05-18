'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/admin/(authenticated)/actions'

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/admin/produtos', label: 'Produtos', icon: '📦' },
    { href: '/admin/pedidos', label: 'Pedidos', icon: '📝' },
  ]

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50">
      
      {/* Overlay para fechar sidebar no mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-biscoito-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-biscoito-800 text-center relative">
          <button 
            className="md:hidden absolute top-4 right-4 text-biscoito-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
          <span className="text-3xl block mb-2" aria-hidden="true">🍪</span>
          <h2 className="font-display font-bold text-xl">Admin</h2>
          <p className="text-biscoito-300 text-sm mt-1">Loja da Madrinha</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map(link => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                  isActive ? 'bg-biscoito-800 text-white' : 'hover:bg-biscoito-800/50 text-biscoito-100'
                }`}
              >
                <span>{link.icon}</span> {link.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-biscoito-800">
          <form action={logout}>
            <button className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-biscoito-800 hover:bg-red-600 rounded-lg transition-colors text-sm font-medium">
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Mobile Header */}
        <header className="md:hidden bg-biscoito-900 text-white p-4 flex items-center justify-between shadow-md z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-biscoito-800 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-bold flex items-center gap-2">🍪 Admin</span>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
