'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

function formatarPreco(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export default function PaginaCarrinho() {
  const { items, valorTotal, atualizarQuantidade, removerDoCarrinho } = useCart()
  
  const [cep, setCep] = useState('')
  const [frete, setFrete] = useState<number | null>(null)
  const [loadingCep, setLoadingCep] = useState(false)
  const [erroCep, setErroCep] = useState('')
  const [endereco, setEndereco] = useState('')

  // Carregar CEP salvo no localStorage ao montar a página
  useEffect(() => {
    const savedCep = localStorage.getItem('@LojaMadrinha:cep')
    if (savedCep) {
      setCep(savedCep)
      // Disparar o cálculo inicial do frete se houver CEP salvo
      const cepLimpo = savedCep.replace(/\D/g, '')
      if (cepLimpo.length === 8) {
        setLoadingCep(true)
        fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
          .then(res => res.json())
          .then(data => {
            if (!data.erro) {
              setEndereco(`${data.logradouro}, ${data.localidade} - ${data.uf}`)
              if (cepLimpo.startsWith('8')) {
                setFrete(8.00)
              } else {
                setFrete(15.00)
              }
            }
          })
          .catch(() => {})
          .finally(() => setLoadingCep(false))
      }
    }
  }, [])

  const calcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      setErroCep('CEP inválido. Digite 8 números.')
      return
    }

    setLoadingCep(true)
    setErroCep('')
    setEndereco('')
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        setErroCep('CEP não encontrado.')
        setFrete(null)
      } else {
        setEndereco(`${data.logradouro}, ${data.localidade} - ${data.uf}`)
        localStorage.setItem('@LojaMadrinha:cep', cepLimpo)
        if (cepLimpo.startsWith('8')) {
          setFrete(8.00)
        } else {
          setFrete(15.00)
        }
      }
    } catch (error) {
      setErroCep('Erro ao buscar o CEP.')
      setFrete(null)
    } finally {
      setLoadingCep(false)
    }
  }

  const total = valorTotal + (frete || 0)

  return (
    <div className="container-pagina py-10">
      <h1 className="font-display font-bold text-4xl text-biscoito-900 mb-8">
        Seu Carrinho 🛒
      </h1>

      {items.length === 0 ? (
        /* Estado vazio */
        <div className="text-center py-20">
          <span className="text-8xl block mb-6" aria-hidden="true">🛒</span>
          <h2 className="font-display font-semibold text-2xl text-biscoito-700 mb-3">
            Seu carrinho está vazio
          </h2>
          <p className="text-biscoito-500 mb-8">
            Explore nosso catálogo e adicione bolachas deliciosas!
          </p>
          <Link href="/catalogo" id="btn-ir-catalogo-vazio" className="btn-primario">
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Lista de itens */}
          <section className="lg:col-span-2" aria-label="Itens do carrinho">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="card p-4 flex items-center gap-4"
                >
                  {/* Ícone do produto */}
                  <div className="w-16 h-16 bg-gradient-to-br from-biscoito-100 to-creme-200 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                    {item.imagem ? (
                      <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" />
                    ) : (
                      '🍪'
                    )}
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-biscoito-900 truncate">{item.nome}</h3>
                    <p className="text-biscoito-500 text-sm">{formatarPreco(item.preco)} cada</p>
                  </div>

                  {/* Controle de quantidade */}
                  <div className="flex items-center gap-2" aria-label={`Quantidade de ${item.nome}`}>
                    <button
                      id={`btn-diminuir-${item.id}`}
                      onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                      className="w-8 h-8 rounded-lg border border-biscoito-200 text-biscoito-600 hover:bg-biscoito-50 font-bold transition-colors"
                      aria-label={`Diminuir quantidade de ${item.nome}`}
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-biscoito-900">
                      {item.quantidade}
                    </span>
                    <button
                      id={`btn-aumentar-${item.id}`}
                      onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                      disabled={item.quantidade >= item.estoque}
                      className={`w-8 h-8 rounded-lg border border-biscoito-200 font-bold transition-colors ${
                        item.quantidade >= item.estoque 
                          ? 'text-biscoito-300 bg-gray-50 cursor-not-allowed' 
                          : 'text-biscoito-600 hover:bg-biscoito-50'
                      }`}
                      aria-label={`Aumentar quantidade de ${item.nome}`}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal do item */}
                  <span className="preco text-base w-20 text-right flex-shrink-0">
                    {formatarPreco(item.preco * item.quantidade)}
                  </span>

                  {/* Remover item */}
                  <button
                    id={`btn-remover-${item.id}`}
                    onClick={() => removerDoCarrinho(item.id)}
                    className="p-2 text-biscoito-300 hover:text-red-500 transition-colors"
                    aria-label={`Remover ${item.nome} do carrinho`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Voltar ao catálogo */}
            <div className="mt-6">
              <Link href="/catalogo" id="btn-continuar-comprando" className="btn-secundario py-2 px-5 text-sm">
                ← Continuar comprando
              </Link>
            </div>
          </section>

          {/* Resumo do pedido */}
          <aside aria-label="Resumo do pedido">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display font-semibold text-xl text-biscoito-900 mb-5">
                Resumo do Pedido
              </h2>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-biscoito-500">Subtotal</dt>
                  <dd className="font-medium text-biscoito-900">{formatarPreco(valorTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-biscoito-500">Frete estimado</dt>
                  <dd className="font-medium text-biscoito-900">
                    {frete !== null ? formatarPreco(frete) : '---'}
                  </dd>
                </div>
                <div className="border-t border-biscoito-100 pt-3 flex justify-between">
                  <dt className="font-bold text-biscoito-900 text-base">Total</dt>
                  <dd className="preco text-xl">{formatarPreco(total)}</dd>
                </div>
              </dl>

              {/* Campo de CEP para calcular frete */}
              <div className="mt-5">
                <label htmlFor="input-cep" className="block text-sm font-medium text-biscoito-700 mb-2">
                  Calcular frete pelo CEP
                </label>
                <div className="flex gap-2">
                  <input
                    id="input-cep"
                    type="text"
                    placeholder="00000-000"
                    maxLength={9}
                    className="input-campo flex-1 py-2.5"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                  />
                  <button
                    id="btn-calcular-frete"
                    onClick={calcularFrete}
                    disabled={loadingCep}
                    className="btn-secundario py-2 px-4 text-sm disabled:opacity-50"
                  >
                    {loadingCep ? 'Buscando...' : 'Calcular'}
                  </button>
                </div>
                {erroCep && <p className="text-red-500 text-xs mt-2">{erroCep}</p>}
                {endereco && <p className="text-green-600 text-xs mt-2">{endereco}</p>}
              </div>

              {/* Botão finalizar */}
              <Link
                href="/checkout"
                id="btn-ir-checkout"
                className="btn-primario w-full mt-5 justify-center"
              >
                Finalizar Pedido →
              </Link>

              {/* Selos de segurança */}
              <p className="text-center text-xs text-biscoito-400 mt-4">
                🔒 Pagamento seguro via Mercado Pago
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
