'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
}

export interface CartItem extends Produto {
  quantidade: number
}

interface CartContextData {
  items: CartItem[]
  adicionarAoCarrinho: (produto: Produto) => void
  removerDoCarrinho: (produtoId: string) => void
  atualizarQuantidade: (produtoId: string, quantidade: number) => void
  limparCarrinho: () => void
  totalItens: number
  valorTotal: number
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  
  // Persistir no localStorage (opcional, mas recomendado)
  useEffect(() => {
    const savedCart = localStorage.getItem('@LojaMadrinha:cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Erro ao ler carrinho do localStorage', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('@LojaMadrinha:cart', JSON.stringify(items))
  }, [items])

  const adicionarAoCarrinho = (produto: Produto) => {
    setItems((prevItems) => {
      const itemExistente = prevItems.find(item => item.id === produto.id)
      if (itemExistente) {
        return prevItems.map(item => 
          item.id === produto.id 
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      }
      return [...prevItems, { ...produto, quantidade: 1 }]
    })
  }

  const removerDoCarrinho = (produtoId: string) => {
    setItems((prevItems) => prevItems.filter(item => item.id !== produtoId))
  }

  const atualizarQuantidade = (produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(produtoId)
      return
    }
    setItems((prevItems) => 
      prevItems.map(item => 
        item.id === produtoId ? { ...item, quantidade } : item
      )
    )
  }

  const limparCarrinho = () => setItems([])

  const totalItens = items.reduce((acc, item) => acc + item.quantidade, 0)
  const valorTotal = items.reduce((acc, item) => acc + (item.preco * item.quantidade), 0)

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        adicionarAoCarrinho, 
        removerDoCarrinho, 
        atualizarQuantidade, 
        limparCarrinho,
        totalItens,
        valorTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
