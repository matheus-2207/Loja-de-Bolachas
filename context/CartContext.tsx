"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import type { StoreProduct } from "@/lib/store";
import { Icon } from "@/components/icon";
export type Produto = StoreProduct;
export interface CartItem extends Produto {
  quantidade: number;
}
interface CartContextData {
  items: CartItem[];
  isLoaded: boolean;
  adicionarAoCarrinho: (produto: Produto, quantidade?: number) => void;
  adicionarSelecao: (selecao: CartItem[]) => void;
  removerDoCarrinho: (produtoId: string) => void;
  atualizarQuantidade: (produtoId: string, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  valorTotal: number;
}
const CartContext = createContext<CartContextData | null>(null);
const KEY = "@LojaMadrinha:cart";
function readCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (p): p is CartItem =>
          typeof p === "object" &&
          p !== null &&
          typeof p.id === "string" &&
          typeof p.nome === "string" &&
          typeof p.preco === "number" &&
          Number.isFinite(p.preco) &&
          p.preco >= 0 &&
          Number.isInteger(p.estoque) &&
          p.estoque > 0 &&
          Number.isInteger(p.quantidade) &&
          p.quantidade > 0,
      )
      .map((p) => ({ ...p, quantidade: Math.min(p.quantidade, p.estoque) }));
  } catch {
    return [];
  }
}
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      setItems(readCart(localStorage.getItem(KEY)));
    } catch {
      /* Armazenamento privado: usar memória. */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(KEY, JSON.stringify(items));
      } catch {
        /* Compra disponível mesmo sem persistência. */
      }
    }
  }, [items, isLoaded]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice, items]);
  const adicionarSelecao = useCallback((selection: CartItem[]) => {
    const valid = selection.filter(
      (p) =>
        Number.isInteger(p.quantidade) &&
        p.quantidade > 0 &&
        p.estoque > 0 &&
        Number.isFinite(p.preco) &&
        p.preco >= 0,
    );
    if (!valid.length) return;
    setItems((prev) =>
      valid.reduce((next, product) => {
        const existing = next.find((p) => p.id === product.id);
        const quantidade = Math.min(
          (existing?.quantidade || 0) + product.quantidade,
          product.estoque,
        );
        return existing
          ? next.map((p) =>
              p.id === product.id ? { ...product, quantidade } : p,
            )
          : [...next, { ...product, quantidade }];
      }, prev),
    );
    setNotice(
      valid.length === 1
        ? `${valid[0].nome} na sua cesta.`
        : "Sua seleção foi adicionada à cesta.",
    );
  }, []);
  const adicionarAoCarrinho = useCallback(
    (product: Produto, quantidade = 1) =>
      adicionarSelecao([{ ...product, quantidade }]),
    [adicionarSelecao],
  );
  const removerDoCarrinho = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setNotice("Produto removido da cesta.");
  }, []);
  const atualizarQuantidade = useCallback((id: string, quantidade: number) => {
    if (!Number.isInteger(quantidade)) return;
    setItems((prev) =>
      quantidade <= 0
        ? prev.filter((p) => p.id !== id)
        : prev.map((p) =>
            p.id === id
              ? { ...p, quantidade: Math.min(quantidade, p.estoque) }
              : p,
          ),
    );
  }, []);
  const limparCarrinho = useCallback(() => {
    setItems([]);
    setNotice("");
  }, []);
  const totalItens = items.reduce((sum, p) => sum + p.quantidade, 0);
  const valorTotal = items.reduce((sum, p) => sum + p.preco * p.quantidade, 0);
  return (
    <CartContext.Provider
      value={{
        items,
        isLoaded,
        adicionarAoCarrinho,
        adicionarSelecao,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
        totalItens,
        valorTotal,
      }}
    >
      {children}
      <div role="status" aria-live="polite" aria-atomic="true">
        {notice && (
          <div className="cart-notice">
            <Icon name="check" />
            <span>{notice}</span>
            <Link href="/carrinho" onClick={() => setNotice("")}>
              Ver cesta
            </Link>
            <button onClick={() => setNotice("")} aria-label="Fechar aviso">
              <Icon name="close" width="16" height="16" />
            </button>
          </div>
        )}
      </div>
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}
