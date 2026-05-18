import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import BotaoExcluir from './BotaoExcluir'

export const dynamic = 'force-dynamic'

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''

  const filter: any = {}
  if (query) {
    filter.OR = [
      { id: { contains: query, mode: 'insensitive' } },
      { nomeCliente: { contains: query, mode: 'insensitive' } },
      { telefone: { contains: query, mode: 'insensitive' } },
    ]
  }

  const pedidos = await prisma.pedido.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' },
    include: {
      itens: {
        include: {
          produto: true
        }
      }
    }
  })

  async function atualizarStatus(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const status = formData.get('status') as any

    if (id && status) {
      await prisma.pedido.update({
        where: { id },
        data: { status }
      })
      revalidatePath('/admin/pedidos')
    }
  }

  const statusOptions = [
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando Pagamento' },
    { value: 'PAGO', label: 'Pago' },
    { value: 'EM_PREPARO', label: 'Em Preparo' },
    { value: 'ENVIADO', label: 'Enviado' },
    { value: 'ENTREGUE', label: 'Entregue' },
    { value: 'CANCELADO', label: 'Cancelado' }
  ]

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
        
        {/* Barra de busca */}
        <form method="GET" className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nº do pedido, cliente ou tel..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-80 focus:ring-2 focus:ring-biscoito-500 outline-none"
          />
          <button type="submit" className="bg-biscoito-500 hover:bg-biscoito-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Buscar
          </button>
          {query && (
            <a href="/admin/pedidos" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center">
              Limpar
            </a>
          )}
        </form>
      </div>

      <div className="space-y-4">
        {pedidos.length === 0 ? (
          <div className="bg-white p-8 text-center text-gray-500 rounded-xl shadow-sm border border-gray-100">
            {query ? 'Nenhum pedido encontrado para a busca.' : 'Nenhum pedido recebido ainda.'}
          </div>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-900">Pedido #{pedido.id}</h3>
                  <p className="text-sm text-gray-500">
                    {pedido.nomeCliente ? pedido.nomeCliente : 'Cliente não identificado'} • {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
                    <p className="font-bold text-gray-900">R$ {Number(pedido.total).toFixed(2).replace('.', ',')}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <form action={atualizarStatus} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={pedido.id} />
                      <select 
                        name="status" 
                        defaultValue={pedido.status}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-biscoito-500 outline-none"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <button type="submit" className="bg-biscoito-100 hover:bg-biscoito-200 text-biscoito-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Atualizar
                      </button>
                    </form>
                    <BotaoExcluir pedidoId={pedido.id} />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Itens do Pedido</h4>
                <ul className="space-y-2">
                  {pedido.itens.map(item => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        <span className="font-medium">{item.quantidade}x</span> {item.produto.nome}
                      </span>
                      <span className="text-gray-500">R$ {Number(item.preco).toFixed(2).replace('.', ',')}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {(pedido.logradouro || pedido.telefone) && (
                <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {pedido.logradouro && (
                    <div>
                      <span className="text-gray-500 block mb-1">Endereço de Entrega</span>
                      <span className="text-gray-800">{pedido.logradouro}{pedido.bairro ? `, ${pedido.bairro}` : ''} {pedido.cep ? `- ${pedido.cep}` : ''}</span>
                    </div>
                  )}
                  {pedido.telefone && (
                    <div>
                      <span className="text-gray-500 block mb-1">Contato</span>
                      <span className="text-gray-800">{pedido.telefone} | {pedido.emailCliente}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
