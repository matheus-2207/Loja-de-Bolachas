"use client";
import { useState } from "react";
import Link from "next/link";
import { StoreImage } from "@/components/store-image";
import { Quantity } from "@/components/quantity";
import { Icon } from "@/components/icon";
import { useCart } from "@/context/CartContext";
import { money, WHATSAPP_URL, type StoreProduct } from "@/lib/store";
export function ProductDetail({ product }: { product: StoreProduct }) {
  const [zoom, setZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { items, adicionarAoCarrinho } = useCart();
  const remaining = Math.max(
    0,
    product.estoque - (items.find((p) => p.id === product.id)?.quantidade || 0),
  );
  const count = Math.min(quantity, remaining);
  return (
    <div className="product-layout">
      <div>
        <div className="product-gallery-main" data-zoom={zoom}>
          <StoreImage
            src={product.imagem}
            alt={zoom ? `Detalhe de ${product.nome}` : product.nome}
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          {product.imagem && (
            <button onClick={() => setZoom(!zoom)} aria-pressed={zoom}>
              <Icon name="zoom" width="18" height="18" />
              {zoom ? "Ver inteira" : "Ver textura"}
            </button>
          )}
        </div>
        {product.imagem && (
          <div
            className="gallery-controls"
            aria-label="Enquadramento da fotografia"
          >
            <button aria-pressed={!zoom} onClick={() => setZoom(false)}>
              A bolacha
            </button>
            <button aria-pressed={zoom} onClick={() => setZoom(true)}>
              De pertinho
            </button>
          </div>
        )}
      </div>
      <div className="product-details">
        <h1>{product.nome}</h1>
        {product.categoria && (
          <p className="product-category">{product.categoria}</p>
        )}
        {product.descricao && (
          <p className="product-detail-description">{product.descricao}</p>
        )}
        <p className="product-detail-price">{money(product.preco)}</p>
        <div className="product-purchase">
          <Quantity
            name={product.nome}
            value={count}
            min={1}
            max={remaining}
            onChange={setQuantity}
          />
          <button
            className="btn-primario"
            disabled={remaining === 0}
            onClick={() => adicionarAoCarrinho(product, count)}
          >
            {product.estoque === 0
              ? "Esgotado"
              : remaining === 0
                ? "Limite na cesta"
                : "Adicionar à cesta"}
            <Icon name="basket" />
          </button>
        </div>
        <p className="small-note">
          {remaining > 0
            ? "Frete calculado pelo CEP. Pagamento combinado no WhatsApp."
            : "Consulte a Madrinha sobre a próxima disponibilidade."}
        </p>
        <details>
          <summary>Ingredientes e informações do produto</summary>
          <p>
            {product.descricao ||
              "Consulte a composição, o peso e os detalhes deste produto com a Madrinha."}{" "}
            Para confirmar ingredientes e alergênicos antes de comprar,{" "}
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Olá! Gostaria de saber os ingredientes e alergênicos de ${product.nome}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              converse com a loja
            </a>
            .
          </p>
        </details>
        <details>
          <summary>Entrega e conservação</summary>
          <p>
            Consulte o frete pelo CEP na cesta. O prazo, a disponibilidade de
            entrega e as orientações de conservação são confirmados diretamente
            com a Madrinha.
          </p>
        </details>
        <details>
          <summary>Para presentear</summary>
          <p>
            Você pode reunir seus favoritos em uma{" "}
            <Link href="/monte-sua-caixa" className="underline">
              seleção personalizada
            </Link>
            . Embalagens especiais e respectivos valores são combinados com a
            loja.
          </p>
        </details>
      </div>
    </div>
  );
}
