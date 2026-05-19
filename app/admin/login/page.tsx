import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { InputSenha } from './InputSenha'

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
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-creme-50 px-4 w-full"
      style={{
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(249, 187, 68, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(217, 137, 42, 0.07) 0%, transparent 50%)'
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-biscoito-100/50">
        <div className="bg-biscoito-700 py-8 text-center relative overflow-hidden">
          {/* Decoração sutil de fundo do cabeçalho */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
          <span className="text-5xl block mb-3 relative z-10 animate-bounce" style={{ animationDuration: '3s' }} aria-hidden="true">🍪</span>
          <h1 className="text-3xl font-display font-bold text-white relative z-10 tracking-wide">Painel Admin</h1>
          <p className="text-biscoito-100 text-sm mt-1 relative z-10">Loja da Madrinha</p>
        </div>
        
        <form action={login} className="p-10 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-biscoito-800 mb-2" htmlFor="usuario">
              Usuário
            </label>
            <input 
              type="text" 
              name="usuario" 
              id="usuario" 
              required
              placeholder="Ex: admin"
              className="input-campo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-biscoito-800 mb-2" htmlFor="senha">
              Senha
            </label>
            <InputSenha />
          </div>
          
          <button 
            type="submit" 
            className="btn-primario w-full text-base font-bold py-3.5 mt-2"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
      
      <a href="/" className="mt-8 text-sm font-semibold text-biscoito-600 hover:text-biscoito-800 transition-colors flex items-center gap-2 hover:underline">
        &larr; Voltar para a loja
      </a>
    </div>
  )
}

