'use server'

import { prisma } from '@/lib/prisma'

export interface CriarPedidoInput {
  nomeCliente: string
  emailCliente: string
  telefone: string
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  itens: {
    produtoId: string
    quantidade: number
    preco: number
  }[]
  frete: number
  total: number
}

export async function criarPedido(dados: CriarPedidoInput) {
  try {
    const logradouroCompleto = `${dados.logradouro}, ${dados.numero}${dados.complemento ? ' - ' + dados.complemento : ''}`

    // Criar o pedido e seus itens associados em uma transação do Prisma
    const pedido = await prisma.$transaction(async (tx) => {
      // Gerar número sequencial para o ID do pedido
      let proximoNumero = 1
      const ultimoPedido = await tx.pedido.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      })

      if (ultimoPedido && ultimoPedido.id.startsWith('LM-')) {
        const match = ultimoPedido.id.match(/LM-(\d+)/)
        if (match) {
          const ultimoNumero = parseInt(match[1], 10)
          proximoNumero = ultimoNumero + 1
        }
      }

      const idSequencial = `LM-${String(proximoNumero).padStart(5, '0')}`

      // 1. Criar o pedido
      const novoPedido = await tx.pedido.create({
        data: {
          id: idSequencial,
          nomeCliente: dados.nomeCliente,
          emailCliente: dados.emailCliente,
          telefone: dados.telefone,
          cep: dados.cep,
          logradouro: logradouroCompleto,
          bairro: dados.bairro,
          frete: dados.frete,
          total: dados.total,
          status: 'PENDENTE',
          itens: {
            create: dados.itens.map((item) => ({
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              preco: item.preco,
            })),
          },
        },
      })

      // 2. Decrementar o estoque dos produtos
      for (const item of dados.itens) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              decrement: item.quantidade,
            },
          },
        })
      }

      return novoPedido
    })

    return { success: true, pedidoId: pedido.id }
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error)
    return { success: false, error: error.message || 'Erro interno ao salvar o pedido' }
  }
}
