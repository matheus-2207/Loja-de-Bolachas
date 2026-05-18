import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'

export default function NovoProdutoPage() {
  async function criarProduto(formData: FormData) {
    'use server'
    
    const nome = formData.get('nome') as string
    const descricao = formData.get('descricao') as string
    const precoStr = formData.get('preco') as string
    const categoria = formData.get('categoria') as string
    const foto = formData.get('foto') as File
    
    // Tratamento simples do preço
    const preco = parseFloat(precoStr.replace(',', '.'))
    
    let imagemUrl = null

    // Upload de arquivo local (para simplificar como discutido)
    if (foto && foto.size > 0) {
      const buffer = Buffer.from(await foto.arrayBuffer())
      const filename = `${Date.now()}-${foto.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      // Criar o diretório se não existir
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      
      const filepath = path.join(uploadDir, filename)
      fs.writeFileSync(filepath, buffer)
      imagemUrl = `/uploads/${filename}`
    }

    await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco,
        categoria,
        imagem: imagemUrl,
        estoque: 10, // Default 10
        ativo: true
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
        <h1 className="text-2xl font-bold text-gray-800">Novo Produto</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form action={criarProduto} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
              <input type="text" name="nome" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="descricao" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input type="number" name="preco" step="0.01" min="0" required placeholder="0.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <input type="text" name="categoria" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Produto</label>
              <input type="file" name="foto" accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-biscoito-600 hover:bg-biscoito-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
