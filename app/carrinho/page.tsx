"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { StoreImage } from "@/components/store-image";
import { Quantity } from "@/components/quantity";
import { Icon } from "@/components/icon";
import { money } from "@/lib/store";
import { useShipping, formatCep } from "@/lib/use-shipping";
export default function PaginaCarrinho() {
  const {
    items,
    isLoaded,
    valorTotal,
    totalItens,
    atualizarQuantidade,
    removerDoCarrinho,
  } = useCart();
  const [cep, setCep] = useState("");
  const shipping = useShipping(cep);
  useEffect(() => {
    try {
      setCep(formatCep(localStorage.getItem("@LojaMadrinha:cep") || ""));
    } catch {
      /* Opcional. */
    }
  }, []);
  if (!isLoaded)
    return (
      <div className="container-pagina state-panel" role="status">
        <p>Preparando sua cesta…</p>
      </div>
    );
  return (
    <div className="container-pagina commerce-page">
      <header className="page-heading">
        <h1>
          Sua cesta.
          <br />
          <em>Uma boa escolha.</em>
        </h1>
        <p>
          {totalItens > 0
            ? `${totalItens} ${totalItens === 1 ? "item escolhido" : "itens escolhidos"} para o seu momento.`
            : "O próximo bom momento começa por aqui."}
        </p>
      </header>
      {!items.length ? (
        <div className="state-panel">
          <Icon name="basket" />
          <h2>Tem espaço para algo gostoso.</h2>
          <p>
            Sua cesta ainda está vazia. Conheça nossas bolachas e encontre as
            suas favoritas.
          </p>
          <Link className="btn-primario" href="/catalogo">
            Conhecer as bolachas <Icon name="arrow" />
          </Link>
        </div>
      ) : (
        <div className="commerce-layout">
          <section aria-label="Itens da cesta">
            <div className="cart-list">
              {items.map((item) => (
                <article className="cart-row" key={item.id}>
                  <Link
                    href={`/produto/${item.id}`}
                    className="cart-image"
                    aria-label={`Conhecer ${item.nome}`}
                  >
                    <StoreImage
                      src={item.imagem}
                      alt={item.nome}
                      sizes="90px"
                    />
                  </Link>
                  <div className="cart-info">
                    <h2>
                      <Link href={`/produto/${item.id}`}>{item.nome}</Link>
                    </h2>
                    <p>{money(item.preco)} por unidade</p>
                    <div className="cart-row-controls">
                      <Quantity
                        value={item.quantidade}
                        min={1}
                        max={item.estoque}
                        name={item.nome}
                        onChange={(n) => atualizarQuantidade(item.id, n)}
                      />
                      <button
                        className="remove-item"
                        aria-label={`Remover ${item.nome}`}
                        onClick={() => removerDoCarrinho(item.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <span className="cart-row-price">
                    {money(item.preco * item.quantidade)}
                  </span>
                </article>
              ))}
            </div>
            <Link href="/catalogo" className="text-link mt-6">
              <Icon name="back" /> Continuar escolhendo
            </Link>
          </section>
          <aside className="order-summary" aria-label="Resumo do pedido">
            <h2>Seu momento, reunido.</h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{money(valorTotal)}</dd>
              </div>
              <div>
                <dt>Frete estimado</dt>
                <dd>
                  {shipping.loading
                    ? "Calculando…"
                    : shipping.frete === null
                      ? "Informe seu CEP"
                      : money(shipping.frete)}
                </dd>
              </div>
              <div className="summary-total">
                <dt>
                  {shipping.frete === null
                    ? "Subtotal sem frete"
                    : "Total estimado"}
                </dt>
                <dd>{money(valorTotal + (shipping.frete || 0))}</dd>
              </div>
            </dl>
            <div className="shipping-field">
              <label htmlFor="cart-cep">Consulte a entrega pelo CEP</label>
              <input
                id="cart-cep"
                className="input-campo"
                value={cep}
                onChange={(e) => {
                  const value = formatCep(e.target.value);
                  setCep(value);
                  try {
                    localStorage.setItem("@LojaMadrinha:cep", value);
                  } catch {
                    /* Opcional. */
                  }
                }}
                placeholder="00000-000"
                inputMode="numeric"
                autoComplete="postal-code"
                aria-invalid={shipping.invalid}
                aria-describedby="shipping-note"
              />
              <p
                id="shipping-note"
                className={shipping.invalid ? "field-error" : "field-note"}
                role="status"
              >
                {shipping.message ||
                  shipping.location ||
                  "O frete aparece assim que você informa o CEP."}
              </p>
            </div>
            <Link href="/checkout" className="btn-primario">
              Continuar para entrega <Icon name="arrow" />
            </Link>
            <p className="order-note">
              O pagamento e a disponibilidade de entrega serão confirmados com a
              Madrinha pelo WhatsApp.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
