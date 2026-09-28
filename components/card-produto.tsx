"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Icon } from "@/components/icon";
import { StoreImage } from "@/components/store-image";
import { money, type StoreProduct } from "@/lib/store";
export function CardProduto({ produto }: { produto: StoreProduct }) {
  const { adicionarAoCarrinho, items } = useCart();
  const inCart = items.find((item) => item.id === produto.id)?.quantidade || 0;
  const available = produto.estoque > inCart;
  return (
    <article className="product-card">
      <Link
        className="product-image"
        href={`/produto/${produto.id}`}
        aria-label={`Conhecer ${produto.nome}`}
      >
        <StoreImage src={produto.imagem} alt={produto.nome} />
        <span className="image-link">
          <Icon name="arrow" />
        </span>
        {produto.estoque === 0 && <span className="stock-label">Esgotado</span>}
      </Link>
      <div className="product-meta">
        <span>{produto.categoria || "Da nossa cozinha"}</span>
        <span>{money(produto.preco)}</span>
      </div>
      <h3>
        <Link href={`/produto/${produto.id}`}>{produto.nome}</Link>
      </h3>
      {produto.descricao && (
        <p className="product-description">{produto.descricao}</p>
      )}
      <button
        className="product-add"
        disabled={!available}
        onClick={() => adicionarAoCarrinho(produto)}
        aria-label={
          available
            ? `Adicionar ${produto.nome} à cesta`
            : `${produto.nome}: limite de estoque`
        }
      >
        <span>
          {produto.estoque === 0
            ? "Indisponível no momento"
            : !available
              ? "Limite de estoque na cesta"
              : "Adicionar à cesta"}
        </span>
        <Icon name={available ? "plus" : "check"} />
      </button>
    </article>
  );
}
