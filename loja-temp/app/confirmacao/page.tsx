import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pedido Confirmado — Loja da Madrinha',
}

export default function PaginaConfirmacao() {
  // Número aleatório para o pedido (simulado)
  const numeroPedido = `LM-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="container-pagina py-20 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-sm border border-green-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-display font-bold text-4xl text-biscoito-900 mb-4 text-center">
        Eba! Pedido Recebido 🎉
      </h1>
      
      <p className="text-lg text-biscoito-600 text-center max-w-xl mb-8">
        Sua encomenda foi confirmada com sucesso. Nossas doceiras já receberam seu pedido e vão prepará-lo com muito carinho!
      </p>

      <div className="card p-8 w-full max-w-md mb-10 text-center">
        <p className="text-biscoito-500 text-sm uppercase tracking-wide font-semibold mb-1">Número do Pedido</p>
        <p className="font-mono text-2xl text-biscoito-900 font-bold mb-6">{numeroPedido}</p>

        <p className="text-biscoito-700 text-sm mb-4">
          Nós enviamos os detalhes do seu pedido para o seu e-mail.
          Qualquer dúvida, é só nos chamar no WhatsApp!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="btn-primario px-8 py-3">
          Voltar para a Home
        </Link>
        <a 
          href="https://wa.me/5541999999999" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-secundario px-8 py-3 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Falar no WhatsApp
        </a>
      </div>
    </div>
  )
}
