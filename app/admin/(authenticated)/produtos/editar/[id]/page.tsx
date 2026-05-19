import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { GerenciadorFoto } from './GerenciadorFoto'
import { uploadImagem } from '@/lib/upload'

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const produto = await prisma.produto.findUnique({
    where: { id: params.id }
  })

  if (!produto) {
    redirect('/admin/produtos')
  }

  async function atualizarProduto(formData: FormData) {
    'use server'
    
    const nome = formData.get('nome') as string
    const descricao = formData.get('descricao') as string
    const precoStr = formData.get('preco') as string
    const categoria = formData.get('categoria') as string
    const estoqueStr = formData.get('estoque') as string
    const foto = formData.get('foto') as File
    
    // Tratamento dos valores numéricos
    const preco = parseFloat(precoStr.replace(',', '.'))
    const estoque = parseInt(estoqueStr, 10)
    
    let imagemUrl = produto?.imagem
    const removerFoto = formData.get('removerFoto') === 'true'

    if (removerFoto) {
      imagemUrl = null
    }

    // Upload de novo arquivo se fornecido (usando utilitário Cloudinary/Local)
    if (foto && foto.size > 0) {
      const novaImagemUrl = await uploadImagem(foto)
      if (novaImagemUrl) {
        imagemUrl = novaImagemUrl
      }
    }

    await prisma.produto.update({
      where: { id: params.id },
      data: {
        nome,
        descricao,
        preco,
        categoria,
        estoque,
        imagem: imagemUrl
      }
    })

    revalidatePath('/admin/produtos')
    revalidatePath('/catalogo')
    revalidatePath('/')
    redirect('/admin/produtos')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/produtos" className="text-gray-500 hover:text-gray-700">
          &larr; Voltar
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Editar Produto</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form action={atualizarProduto} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
              <input type="text" name="nome" defaultValue={produto.nome} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="descricao" defaultValue={produto.descricao || ''} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input type="number" name="preco" defaultValue={Number(produto.preco)} step="0.01" min="0" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
              <input type="number" name="estoque" defaultValue={produto.estoque} min="0" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <input type="text" name="categoria" defaultValue={produto.categoria || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Produto</label>
              <GerenciadorFoto fotoAtual={produto.imagem} />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/admin/produtos" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="bg-biscoito-600 hover:bg-biscoito-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
