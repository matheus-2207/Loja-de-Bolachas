import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function LoginPage() {
  async function login(formData: FormData) {
    'use server'
    const usuario = formData.get('usuario')
    const senha = formData.get('senha')

    if (usuario === 'admin' && senha === 'madrinha123') {
      cookies().set('admin_logged_in', 'true', { secure: true, httpOnly: true })
      redirect('/admin')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-biscoito-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-biscoito-700 py-6 text-center">
          <span className="text-4xl block mb-2" aria-hidden="true">🍪</span>
          <h1 className="text-2xl font-display font-bold text-white">Painel Admin</h1>
        </div>
        
        <form action={login} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="usuario">Usuário</label>
            <input 
              type="text" 
              name="usuario" 
              id="usuario" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 focus:border-biscoito-500 outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="senha">Senha</label>
            <input 
              type="password" 
              name="senha" 
              id="senha" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 focus:border-biscoito-500 outline-none transition-colors"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-biscoito-600 hover:bg-biscoito-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
      
      <a href="/" className="mt-8 text-biscoito-600 hover:text-biscoito-800 transition-colors">
        &larr; Voltar para a loja
      </a>
    </div>
  )
}
