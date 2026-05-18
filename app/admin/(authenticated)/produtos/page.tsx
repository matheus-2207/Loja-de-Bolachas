import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function ProdutosPage() {
  const produtos = await prisma.produto.findMany({
    orderBy: { createdAt: 'desc' }
  })

  async function deletarProduto(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    if (id) {
      await prisma.produto.delete({ where: { id } })
      revalidatePath('/admin/produtos')
      revalidatePath('/catalogo')
      revalidatePath('/')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <Link 
          href="/admin/produtos/novo" 
          className="bg-biscoito-600 hover:bg-biscoito-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Novo Produto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Preço</th>
                <th className="px-6 py-4 font-medium">Estoque</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              ) : (
                produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{produto.nome}</td>
                    <td className="px-6 py-4 text-gray-600">{produto.categoria || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">R$ {Number(produto.preco).toFixed(2).replace('.', ',')}</td>
                    <td className="px-6 py-4 text-gray-600">{produto.estoque}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${produto.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 items-center">
                        <Link href={`/admin/produtos/editar/${produto.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          Editar
                        </Link>
                        <form action={deletarProduto}>
                          <input type="hidden" name="id" value={produto.id} />
                          <button type="submit" className="text-red-600 hover:text-red-800 font-medium">
                            Excluir
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {produtos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Nenhum produto cadastrado.</div>
          ) : (
            produtos.map((produto) => (
              <div key={produto.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{produto.nome}</h3>
                    <p className="text-sm text-gray-500">{produto.categoria || '-'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${produto.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {produto.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-1">
                  <div>
                    <p className="font-medium text-gray-900">R$ {Number(produto.preco).toFixed(2).replace('.', ',')}</p>
                    <p className="text-xs text-gray-500 mt-1">Estoque: {produto.estoque} un.</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/produtos/editar/${produto.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                      Editar
                    </Link>
                    <form action={deletarProduto}>
                      <input type="hidden" name="id" value={produto.id} />
                      <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
