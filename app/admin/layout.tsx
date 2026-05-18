import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // O Header e Footer principais já são ocultados pelo usePathname
  // Vamos renderizar uma sidebar de admin simples
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - renderizada apenas nas rotas filhas, mas este layout envelopa tanto /login quanto /(auth) */}
      {/* Espera, o /login vai herdar isso, então é melhor colocar a sidebar num layout aninhado ou renderizar condicionalmente */}
      {children}
    </div>
  )
}
