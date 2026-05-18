'use client'

import { excluirPedido } from '../actions'
import { useTransition } from 'react'

interface BotaoExcluirProps {
  pedidoId: string
}

export default function BotaoExcluir({ pedidoId }: BotaoExcluirProps) {
  const [isPending, startTransition] = useTransition()

  const handleExcluir = () => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      startTransition(async () => {
        await excluirPedido(pedidoId)
      })
    }
  }

  return (
    <button
      type="button"
      onClick={handleExcluir}
      disabled={isPending}
      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
    >
      {isPending ? 'Excluindo...' : 'Excluir'}
    </button>
  )
}
