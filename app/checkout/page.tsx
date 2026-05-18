'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { criarPedido } from './actions'

function formatarPreco(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

export default function PaginaCheckout() {
  const { items, valorTotal, totalItens, limparCarrinho } = useCart()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [loadingCep, setLoadingCep] = useState(false)
  const [frete, setFrete] = useState<number | null>(null)
  const [metodoPagamento, setMetodoPagamento] = useState('pix')
  const [submitting, setSubmitting] = useState(false)

  // Carregar CEP salvo no localStorage ao montar a página
  useEffect(() => {
    const savedCep = localStorage.getItem('@LojaMadrinha:cep')
    if (savedCep) {
      setCep(savedCep)
    }
  }, [])

  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length === 8) {
      setLoadingCep(true)
      fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setLogradouro(data.logradouro || '')
            setBairro(data.bairro || '')
            if (cepLimpo.startsWith('8')) {
              setFrete(8.00)
            } else {
              setFrete(15.00)
            }
          } else {
            setFrete(null)
          }
        })
        .catch(() => {
          setFrete(null)
        })
        .finally(() => setLoadingCep(false))
    } else {
      setFrete(null)
    }
  }, [cep])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || !email || !telefone || !cep || !logradouro || !numero || !bairro) {
      alert('Por favor, preencha todos os campos obrigatórios e calcule o CEP.')
      return
    }

    if (items.length === 0) {
      alert('Seu carrinho está vazio.')
      return
    }

    setSubmitting(true)
    try {
      const { success, pedidoId, error } = await criarPedido({
        nomeCliente: nome,
        emailCliente: email,
        telefone,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        itens: items.map(item => ({
          produtoId: item.id,
          quantidade: item.quantidade,
          preco: Number(item.preco)
        })),
        frete: frete || 0,
        total: valorTotal + (frete || 0)
      })

      if (success && pedidoId) {
        limparCarrinho()
        window.location.href = `/confirmacao?pedidoId=${pedidoId}`
      } else {
        alert(error || 'Ocorreu um erro ao processar o seu pedido.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro de conexão ao enviar o pedido. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="container-pagina py-10">
      <h1 className="font-display font-bold text-4xl text-biscoito-900 mb-2">
        Finalizar Pedido 📦
      </h1>
      <p className="text-biscoito-500 mb-8">Preencha seus dados para concluir a compra</p>

      {/* Indicador de progresso */}
      <nav className="mb-10" aria-label="Etapas do checkout">
        <ol className="flex items-center gap-0">
          {[
            { num: 1, label: 'Carrinho',  href: '/carrinho', ativo: false, concluido: true },
            { num: 2, label: 'Dados',     href: '#',         ativo: true,  concluido: false },
            { num: 3, label: 'Pagamento', href: '#',         ativo: false, concluido: false },
          ].map((etapa, idx) => (
            <li key={etapa.num} className="flex items-center">
              <div className={`flex items-center gap-2 text-sm font-medium ${
                etapa.ativo ? 'text-biscoito-600' :
                etapa.concluido ? 'text-biscoito-400' : 'text-biscoito-300'
              }`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  etapa.ativo ? 'bg-biscoito-500 text-white' :
                  etapa.concluido ? 'bg-biscoito-200 text-biscoito-600' : 'bg-biscoito-100 text-biscoito-300'
                }`}>
                  {etapa.concluido ? '✓' : etapa.num}
                </span>
                <span className="hidden sm:block">{etapa.label}</span>
              </div>
              {idx < 2 && (
                <div className="w-12 sm:w-20 h-0.5 bg-biscoito-200 mx-2" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Formulário principal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Dados pessoais */}
          <section className="card p-6" aria-labelledby="titulo-dados-pessoais">
            <h2 id="titulo-dados-pessoais" className="font-display font-semibold text-xl text-biscoito-900 mb-5">
              Dados pessoais
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="input-nome" className="block text-sm font-medium text-biscoito-700 mb-1.5">
                  Nome completo <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input 
                  id="input-nome" 
                  type="text" 
                  placeholder="Maria da Silva" 
                  className="input-campo" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label htmlFor="input-email" className="block text-sm font-medium text-biscoito-700 mb-1.5">
                  E-mail <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input 
                  id="input-email" 
                  type="email" 
                  placeholder="maria@email.com" 
                  className="input-campo" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label htmlFor="input-telefone" className="block text-sm font-medium text-biscoito-700 mb-1.5">
                  WhatsApp/Telefone <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input 
                  id="input-telefone" 
                  type="tel" 
                  placeholder="(41) 99999-9999" 
                  className="input-campo" 
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required 
                />
              </div>
            </div>
          </section>

          {/* Endereço de entrega */}
          <section className="card p-6" aria-labelledby="titulo-endereco">
            <h2 id="titulo-endereco" className="font-display font-semibold text-xl text-biscoito-900 mb-5">
              Endereço de entrega
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label htmlFor="input-cep-checkout" className="block text-sm font-medium text-biscoito-700 mb-1.5">
                  CEP <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="flex gap-2 items-center">
                  <input 
                    id="input-cep-checkout" 
                    type="text" 
                    placeholder="00000-000" 
                    maxLength={9} 
                    className="input-campo" 
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    required 
                  />
                  {loadingCep && <span className="text-xs text-biscoito-500">Buscando...</span>}
                </div>
                <p className="text-xs text-biscoito-400 mt-1">O frete será calculado automaticamente.</p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="input-logradouro" className="block text-sm font-medium text-biscoito-700 mb-1.5">
                  Logradouro
                </label>
                <input 
                  id="input-logradouro" 
                  type="text" 
                  placeholder="Rua das Bolachas" 
                  className="input-campo bg-gray-50" 
                  value={logradouro}
                  readOnly 
                />
              </div>

              <div>
                <label htmlFor="input-numero" className="block text-sm font-medium text-biscoito-700 mb-1.5">
                  Número <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input 
                  id="input-numero" 
                  type="text" 
                  placeholder="123" 
                  className="input-campo" 
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label htmlFor="input-complemento" className="block text-sm font-medium text-biscoito-700 mb-1.5">
                  Complemento
                </label>
                <input 
                  id="input-complemento" 
                  type="text" 
                  placeholder="Apto 42" 
                  className="input-campo" 
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="input-bairro" className="block text-sm font-medium text-biscoito-700 mb-1.5">
                  Bairro
                </label>
                <input 
                  id="input-bairro" 
                  type="text" 
                  placeholder="Centro" 
                  className="input-campo bg-gray-50" 
                  value={bairro}
                  readOnly 
                />
              </div>
            </div>
          </section>

          {/* Forma de pagamento */}
          <section className="card p-6" aria-labelledby="titulo-pagamento">
            <h2 id="titulo-pagamento" className="font-display font-semibold text-xl text-biscoito-900 mb-5">
              Forma de pagamento
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'pix',    label: 'PIX',           emoji: '⚡', descricao: 'Aprovação instantânea' },
                { id: 'cartao', label: 'Cartão de crédito', emoji: '💳', descricao: 'Em até 12x' },
              ].map((metodo) => (
                <label
                  key={metodo.id}
                  htmlFor={`pagamento-${metodo.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-biscoito-200 hover:border-biscoito-400 cursor-pointer transition-all duration-200 has-[:checked]:border-biscoito-500 has-[:checked]:bg-biscoito-50"
                >
                  <input
                    type="radio"
                    id={`pagamento-${metodo.id}`}
                    name="metodo-pagamento"
                    value={metodo.id}
                    className="accent-biscoito-500"
                    checked={metodoPagamento === metodo.id}
                    onChange={() => setMetodoPagamento(metodo.id)}
                  />
                  <div>
                    <p className="font-semibold text-biscoito-900">
                      <span aria-hidden="true">{metodo.emoji} </span>{metodo.label}
                    </p>
                    <p className="text-xs text-biscoito-400">{metodo.descricao}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Resumo lateral */}
        <aside aria-label="Resumo do pedido">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-semibold text-xl text-biscoito-900 mb-5">
              Resumo
            </h2>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-biscoito-500">
                  {totalItens} {totalItens === 1 ? 'item' : 'itens'}
                </dt>
                <dd className="font-medium">{formatarPreco(valorTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-biscoito-500">Frete</dt>
                <dd className="font-medium">
                  {frete !== null ? formatarPreco(frete) : '---'}
                </dd>
              </div>
              <div className="border-t border-biscoito-100 pt-3 flex justify-between">
                <dt className="font-bold text-biscoito-900 text-base">Total</dt>
                <dd className="preco text-xl">
                  {formatarPreco(valorTotal + (frete || 0))}
                </dd>
              </div>
            </dl>

            <button
              id="btn-confirmar-pedido"
              type="submit"
              disabled={submitting}
              className="btn-primario w-full mt-6 justify-center disabled:opacity-50"
            >
              {submitting ? 'Processando...' : 'Confirmar Pedido →'}
            </button>

            <p className="text-center text-xs text-biscoito-400 mt-3">
              🔒 Dados protegidos pelo Mercado Pago
            </p>

            <Link href="/carrinho" className="block text-center text-sm text-biscoito-400 hover:text-biscoito-600 mt-3 transition-colors">
              ← Voltar ao carrinho
            </Link>
          </div>
        </aside>
      </div>
    </form>
  )
}
