'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function PaginaCheckout() {
  const router = useRouter()
  const { items, totalItens, valorTotal, limparCarrinho } = useCart()

  // Estados do formulário
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState({ logradouro: '', bairro: '', localidade: '', uf: '' })
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [loadingCep, setLoadingCep] = useState(false)
  const [processando, setProcessando] = useState(false)

  // Redireciona de volta se o carrinho estiver vazio
  useEffect(() => {
    if (items.length === 0 && !processando) {
      router.push('/carrinho')
    }
  }, [items, router, processando])

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  }

  // Busca CEP na API do ViaCEP
  const buscarCep = async (cepBuscado: string) => {
    const cepLimpo = cepBuscado.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    setLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        setEndereco({
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf
        })
      } else {
        alert('CEP não encontrado!')
      }
    } catch (error) {
      console.error('Erro ao buscar CEP', error)
      alert('Erro ao buscar CEP')
    } finally {
      setLoadingCep(false)
    }
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCep(value)
    if (value.replace(/\D/g, '').length === 8) {
      buscarCep(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessando(true)
    
    // Simula tempo de processamento de pagamento
    setTimeout(() => {
      limparCarrinho()
      router.push('/confirmacao')
    }, 1500)
  }

  if (items.length === 0 && !processando) return null

  return (
    <div className="container-pagina py-12 md:py-20">
      <h1 className="font-display font-bold text-4xl text-biscoito-900 mb-8">
        Finalizar Pedido 📦
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Dados */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dados Pessoais */}
          <section className="card p-6">
            <h2 className="font-display font-semibold text-2xl text-biscoito-900 mb-6">Seus Dados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-biscoito-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-biscoito-200 rounded-lg p-3 focus:ring-2 focus:ring-biscoito-400 focus:border-transparent outline-none transition-all text-biscoito-900"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-biscoito-700 mb-1">E-mail</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-biscoito-200 rounded-lg p-3 focus:ring-2 focus:ring-biscoito-400 focus:border-transparent outline-none transition-all text-biscoito-900"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-biscoito-700 mb-1">Telefone / WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full border border-biscoito-200 rounded-lg p-3 focus:ring-2 focus:ring-biscoito-400 focus:border-transparent outline-none transition-all text-biscoito-900"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </section>

          {/* Endereço */}
          <section className="card p-6">
            <h2 className="font-display font-semibold text-2xl text-biscoito-900 mb-6">Endereço de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-biscoito-700 mb-1">CEP</label>
                <input 
                  type="text" 
                  required
                  value={cep}
                  onChange={handleCepChange}
                  maxLength={9}
                  className={`w-full border border-biscoito-200 rounded-lg p-3 focus:ring-2 focus:ring-biscoito-400 focus:border-transparent outline-none transition-all text-biscoito-900 ${loadingCep ? 'bg-biscoito-50' : ''}`}
                  placeholder="00000-000"
                />
              </div>
              
              <div className="md:col-span-8">
                <label className="block text-sm font-medium text-biscoito-700 mb-1">Logradouro (Rua, Av.)</label>
                <input 
                  type="text" 
                  required
                  value={endereco.logradouro}
                  onChange={(e) => setEndereco({...endereco, logradouro: e.target.value})}
                  className="w-full border border-biscoito-200 rounded-lg p-3 focus:ring-2 focus:ring-biscoito-400 outline-none text-biscoito-900"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-biscoito-700 mb-1">Número</label>
                <input 
                  type="text" 
                  required
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full border border-biscoito-200 rounded-lg p-3 focus:ring-2 focus:ring-biscoito-400 outline-none text-biscoito-900"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-biscoito-700 mb-1">Complemento</label>
                <input 
                  type="text" 
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  className="w-full border border-biscoito-200 rounded-lg p-3 focus:ring-2 focus:ring-biscoito-400 outline-none text-biscoito-900"
                  placeholder="Apto, Casa 2..."
                />
              </div>

              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-biscoito-700 mb-1">Bairro</label>
                <input 
                  type="text" 
                  required
                  value={endereco.bairro}
                  onChange={(e) => setEndereco({...endereco, bairro: e.target.value})}
                  className="w-full border border-biscoito-200 rounded-lg p-3 focus:ring-2 focus:ring-biscoito-400 outline-none text-biscoito-900"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Resumo e Pagamento */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-semibold text-2xl text-biscoito-900 mb-6 border-b border-biscoito-100 pb-4">
              Sua Encomenda
            </h2>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-biscoito-700">{item.quantidade}x {item.nome}</span>
                  <span className="font-medium text-biscoito-900">{formatarPreco(item.preco * item.quantidade)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6 border-t border-biscoito-100 pt-4">
              <div className="flex justify-between items-center text-biscoito-700">
                <span>Subtotal ({totalItens} itens)</span>
                <span>{formatarPreco(valorTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-biscoito-700">
                <span>Frete Fixo</span>
                <span>{formatarPreco(10.00)}</span>
              </div>
              <div className="pt-4 border-t border-biscoito-100 flex justify-between items-center">
                <span className="font-bold text-lg text-biscoito-900">Total a Pagar</span>
                <span className="preco text-2xl">{formatarPreco(valorTotal + 10)}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={processando}
              className={`w-full text-lg py-4 mb-3 flex items-center justify-center gap-2 ${processando ? 'bg-biscoito-300 cursor-wait' : 'btn-primario'}`}
            >
              {processando ? (
                <span>Processando...</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Pagar com Mercado Pago
                </>
              )}
            </button>
            <p className="text-xs text-center text-biscoito-500">
              Pagamento simulado. Você será redirecionado em instantes após o clique.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
