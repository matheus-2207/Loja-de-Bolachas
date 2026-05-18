import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Pedido Confirmado! 🎉',
  description: 'Seu pedido foi confirmado. Obrigada pela compra na Loja da Madrinha!',
}

interface Props {
  searchParams: {
    pedidoId?: string
  }
}

function formatarPreco(valor: any): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor))
}

const STATUS_MAP: Record<string, string> = {
  PENDENTE: 'Pendente',
  AGUARDANDO_PAGAMENTO: 'Aguardando pagamento',
  PAGO: 'Pago',
  EM_PREPARO: 'Em preparo',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
}

const STATUS_COLORS: Record<string, string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  AGUARDANDO_PAGAMENTO: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  PAGO: 'bg-green-100 text-green-700 border-green-200',
  EM_PREPARO: 'bg-blue-100 text-blue-700 border-blue-200',
  ENVIADO: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  ENTREGUE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELADO: 'bg-red-100 text-red-700 border-red-200',
}

export default async function PaginaConfirmacao({ searchParams }: Props) {
  const pedidoId = searchParams.pedidoId
  if (!pedidoId) {
    notFound()
  }

  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      itens: {
        include: {
          produto: true,
        },
      },
    },
  })

  if (!pedido) {
    notFound()
  }

  const statusText = STATUS_MAP[pedido.status] || 'Pendente'
  const statusColor = STATUS_COLORS[pedido.status] || 'bg-yellow-100 text-yellow-700'

  return (
    <div className="container-pagina py-16">
      <div className="max-w-2xl mx-auto text-center">

        {/* Animação de sucesso */}
        <div
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-bounce"
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Título */}
        <h1 className="font-display font-bold text-4xl md:text-5xl text-biscoito-900 mb-4">
          Pedido confirmado! 🍪
        </h1>

        <p className="text-lg text-biscoito-600 mb-8 leading-relaxed">
          Obrigada pela sua compra, <strong>{pedido.nomeCliente}</strong>! Seu pedido foi recebido e já estamos
          separando as bolachas com muito carinho.
        </p>

        {/* Card com detalhes do pedido */}
        <div className="card p-8 mb-8 text-left border border-biscoito-100 shadow-md bg-white">
          <h2 className="font-display font-semibold text-xl text-biscoito-900 mb-5">
            Detalhes do pedido
          </h2>

          <dl className="space-y-4">
            <div className="flex justify-between items-start">
              <dt className="text-biscoito-500 text-sm">Número do pedido</dt>
              <dd className="font-bold text-biscoito-900 font-mono text-sm">{pedido.id}</dd>
            </div>

            <div className="flex justify-between items-start">
              <dt className="text-biscoito-500 text-sm">Status</dt>
              <dd>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${statusColor}`}>
                  <span className="w-1.5 h-1.5 bg-current rounded-full" aria-hidden="true" />
                  {statusText}
                </span>
              </dd>
            </div>

            <div className="flex justify-between items-start">
              <dt className="text-biscoito-500 text-sm">Total pago</dt>
              <dd className="preco text-xl">{formatarPreco(pedido.total)}</dd>
            </div>

            <div className="border-t border-biscoito-100 pt-4">
              <dt className="text-biscoito-500 text-sm mb-2">Itens do pedido</dt>
              <dd>
                <ul className="space-y-2">
                  {pedido.itens.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-biscoito-700">
                        {item.produto?.nome || 'Bolacha'} ×{item.quantidade}
                      </span>
                      <span className="font-medium">{formatarPreco(Number(item.preco) * item.quantidade)}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="border-t border-biscoito-100 pt-4 text-xs text-biscoito-500">
              <p><strong>Entregar em:</strong> {pedido.logradouro} - {pedido.bairro}</p>
              <p className="mt-1"><strong>CEP:</strong> {pedido.cep} | <strong>Telefone:</strong> {pedido.telefone}</p>
            </div>
          </dl>
        </div>

        {/* Próximos passos */}
        <div className="bg-creme-50 border border-creme-200 rounded-2xl p-6 mb-8 text-left">
          <h2 className="font-display font-semibold text-lg text-biscoito-900 mb-4">
            📋 Próximos passos
          </h2>
          <ol className="space-y-3 text-sm text-biscoito-600">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-biscoito-200 text-biscoito-700 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs text-center line-height-none">1</span>
              <span>Você receberá um e-mail de confirmação em <strong>{pedido.emailCliente}</strong> com os detalhes do pedido.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-biscoito-200 text-biscoito-700 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs text-center line-height-none">2</span>
              <span>Após a confirmação do pagamento, as bolachas serão preparadas.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-biscoito-200 text-biscoito-700 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs text-center line-height-none">3</span>
              <span>Entraremos em contato pelo WhatsApp para combinar a entrega no telefone <strong>{pedido.telefone}</strong>.</span>
            </li>
          </ol>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" id="btn-voltar-home" className="btn-primario px-8">
            Voltar à Loja
          </Link>
          <a
            href={`https://wa.me/5541999999999?text=Olá,%20gostaria%20de%20confirmar%20o%20pedido%20${pedido.id}`}
            id="btn-whatsapp-confirmacao"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secundario px-8"
          >
            <span aria-hidden="true">💬 </span> Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
