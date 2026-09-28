"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { StoreImage } from "@/components/store-image";
import { Quantity } from "@/components/quantity";
import { Icon } from "@/components/icon";
import { money, WHATSAPP_URL, type StoreProduct } from "@/lib/store";
export function BoxBuilder({ products }: { products: StoreProduct[] }) {
  const { items, adicionarSelecao } = useCart();
  const [selection, setSelection] = useState<Record<string, number>>({});
  const [added, setAdded] = useState(false);
  const maxFor = (p: StoreProduct) =>
    Math.max(
      0,
      p.estoque - (items.find((i) => i.id === p.id)?.quantidade || 0),
    );
  const chosen = products
    .map((p) => ({
      ...p,
      quantidade: Math.min(selection[p.id] || 0, maxFor(p)),
    }))
    .filter((p) => p.quantidade > 0);
  const count = chosen.reduce((s, p) => s + p.quantidade, 0);
  const total = chosen.reduce((s, p) => s + p.quantidade * p.preco, 0);
  return (
    <div className="commerce-layout">
      <div className="builder-list">
        {products.map((p) => (
          <article className="builder-row" key={p.id}>
            <Link
              href={`/produto/${p.id}`}
              className="cart-image"
              aria-label={`Conhecer ${p.nome}`}
            >
              <StoreImage src={p.imagem} alt={p.nome} sizes="90px" />
            </Link>
            <div>
              <h2>
                <Link href={`/produto/${p.id}`}>{p.nome}</Link>
              </h2>
              <p>
                {money(p.preco)}
                {maxFor(p) === 0 && " · Sem disponibilidade adicional"}
              </p>
            </div>
            <Quantity
              name={p.nome}
              value={Math.min(selection[p.id] || 0, maxFor(p))}
              max={maxFor(p)}
              onChange={(n) => {
                setSelection((prev) => ({ ...prev, [p.id]: n }));
                setAdded(false);
              }}
            />
          </article>
        ))}
      </div>
      <aside className="order-summary">
        <h2>A sua seleção</h2>
        <p className="selection-count" aria-live="polite">
          {count}
          <span>
            {count === 1 ? "unidade escolhida" : "unidades escolhidas"}
          </span>
        </p>
        <p className="builder-summary-note">
          Escolha as quantidades dos produtos que você quer reunir. Cada unidade
          corresponde ao produto anunciado no catálogo.
        </p>
        {chosen.length > 0 && (
          <ul className="summary-items">
            {chosen.map((p) => (
              <li key={p.id}>
                <span>
                  {p.quantidade} × {p.nome}
                </span>
                <span>{money(p.preco * p.quantidade)}</span>
              </li>
            ))}
          </ul>
        )}
        <dl>
          <div className="summary-total">
            <dt>Subtotal</dt>
            <dd>{money(total)}</dd>
          </div>
        </dl>
        <p className="small-note">Frete calculado na cesta.</p>
        <button
          className="btn-primario"
          disabled={count === 0}
          onClick={() => {
            adicionarSelecao(chosen);
            setSelection({});
            setAdded(true);
          }}
        >
          Adicionar seleção <Icon name="basket" />
        </button>
        {added && (
          <p className="field-note" role="status">
            Seleção adicionada.{" "}
            <Link className="underline" href="/carrinho">
              Conferir minha cesta
            </Link>
          </p>
        )}
        <p className="order-note">
          Quer uma caixa para presente?{" "}
          <a
            className="underline"
            href={`${WHATSAPP_URL}?text=${encodeURIComponent("Olá! Gostaria de conhecer as opções de embalagem para presente.")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Combine a embalagem com a Madrinha.
          </a>{" "}
          Embalagem especial não incluída no subtotal.
        </p>
      </aside>
    </div>
  );
}
