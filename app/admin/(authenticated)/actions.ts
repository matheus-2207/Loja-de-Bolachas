'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function logout() {
  cookies().delete('admin_logged_in')
  redirect('/admin/login')
}

export async function excluirPedido(id: string) {
  try {
    await prisma.pedido.delete({
      where: { id },
    })
    revalidatePath('/admin/pedidos')
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
  }
}
