"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { criarPedido } from "./actions";
import { Icon } from "@/components/icon";
import { money, WHATSAPP_URL } from "@/lib/store";
import { useShipping, formatCep } from "@/lib/use-shipping";
interface Delivery {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
}
const initial: Delivery = {
  nome: "",
  email: "",
  telefone: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
};
export default function PaginaCheckout() {
  const { items, isLoaded, valorTotal, totalItens, limparCarrinho } = useCart();
  const [data, setData] = useState<Delivery>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ id: string; url: string } | null>(
    null,
  );
  const lock = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const shipping = useShipping(data.cep);
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem("madrinha:checkout");
      const parsed = draft ? JSON.parse(draft) : {};
      const restored = Object.fromEntries(
        Object.keys(initial).map((key) => [
          key,
          typeof parsed[key] === "string" ? parsed[key] : "",
        ]),
      ) as unknown as Delivery;
      setData({
        ...restored,
        cep:
          restored.cep ||
          formatCep(localStorage.getItem("@LojaMadrinha:cep") || ""),
      });
    } catch {
      /* O formulário permanece disponível. */
    }
  }, []);
  useEffect(() => {
    if (shipping.street || shipping.neighborhood)
      setData((prev) => ({
        ...prev,
        logradouro: shipping.street,
        bairro: shipping.neighborhood,
      }));
  }, [shipping.street, shipping.neighborhood]);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  useEffect(() => {
    if (success) successRef.current?.focus();
  }, [success]);
  const update = (key: keyof Delivery, value: string) => {
    setData((prev) => {
      const next = {
        ...prev,
        [key]: value,
        ...(key === "cep" ? { logradouro: "", bairro: "" } : {}),
      };
      try {
        sessionStorage.setItem("madrinha:checkout", JSON.stringify(next));
      } catch {
        /* Opcional. */
      }
      return next;
    });
    setError("");
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (lock.current) return;
    if (shipping.loading || shipping.frete === null || shipping.invalid) {
      setError(
        "Confira o CEP e aguarde o cálculo do frete antes de continuar.",
      );
      return;
    }
    if (!items.length) {
      setError(
        "Sua cesta está vazia. Escolha seus produtos antes de continuar.",
      );
      return;
    }
    lock.current = true;
    setSubmitting(true);
    setError("");
    try {
      const result = await criarPedido({
        nomeCliente: data.nome,
        emailCliente: data.email,
        telefone: data.telefone,
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        itens: items.map((p) => ({
          produtoId: p.id,
          quantidade: p.quantidade,
          preco: p.preco,
        })),
        frete: shipping.frete,
        total: valorTotal + shipping.frete,
      });
      if (!result.success || !result.pedidoId) {
        setError(
          result.error ||
            "Não foi possível registrar o pedido. Sua cesta foi mantida. Tente novamente.",
        );
        return;
      }
      const message = [
        "Olá! Gostaria de confirmar este pedido:",
        "",
        `Pedido: ${result.pedidoId}`,
        `Cliente: ${data.nome}`,
        "",
        ...items.map(
          (p) =>
            `${p.quantidade} × ${p.nome} — ${money(p.preco * p.quantidade)}`,
        ),
        "",
        `Subtotal: ${money(valorTotal)}`,
        `Frete: ${money(shipping.frete)}`,
        `Total: ${money(valorTotal + shipping.frete)}`,
        "",
        `Entrega: ${data.logradouro}, ${data.numero}${data.complemento ? ` — ${data.complemento}` : ""}, ${data.bairro}. CEP ${data.cep}`,
      ].join("\n");
      setSuccess({
        id: result.pedidoId,
        url: `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`,
      });
      limparCarrinho();
      try {
        sessionStorage.removeItem("madrinha:checkout");
      } catch {
        /* Opcional. */
      }
    } catch {
      setError(
        "A conexão foi interrompida. Sua cesta foi mantida. Antes de tentar novamente, confirme com a loja se o pedido foi recebido.",
      );
    } finally {
      setSubmitting(false);
      lock.current = false;
    }
  };
  if (success)
    return (
      <div className="container-pagina state-panel">
        <div className="confirmation-icon">
          <Icon name="check" />
        </div>
        <h1 ref={successRef} tabIndex={-1}>
          Seu pedido está registrado.
        </h1>
        <p>
          Pedido <strong>{success.id}</strong>. Agora, envie os detalhes para a
          Madrinha no WhatsApp para combinar o pagamento e a entrega.
        </p>
        <div className="state-actions">
          <a
            href={success.url}
            className="btn-primario"
            target="_blank"
            rel="noopener noreferrer"
          >
            Continuar no WhatsApp <Icon name="arrow" />
          </a>
          <Link
            href={`/confirmacao?pedidoId=${encodeURIComponent(success.id)}`}
            className="btn-secundario"
          >
            Ver meu pedido
          </Link>
        </div>
        <p className="small-note">
          O pedido ainda aguarda confirmação e pagamento. A mensagem só será
          enviada quando você confirmar no WhatsApp.
        </p>
      </div>
    );
  if (!isLoaded)
    return (
      <div className="container-pagina state-panel" role="status">
        <p>Preparando seu pedido…</p>
      </div>
    );
  if (!items.length)
    return (
      <div className="container-pagina state-panel">
        <Icon name="basket" />
        <h1>Vamos começar pela sua cesta?</h1>
        <p>Escolha suas bolachas para continuar com os dados de entrega.</p>
        <Link className="btn-primario" href="/catalogo">
          Conhecer as bolachas <Icon name="arrow" />
        </Link>
      </div>
    );
  const field = (
    key: keyof Delivery,
    label: string,
    autoComplete: string,
    type = "text",
    required = true,
    wide = false,
  ) => (
    <div className={`form-field ${wide ? "wide" : ""}`}>
      <label htmlFor={`checkout-${key}`}>
        {label}
        {!required && <span> (opcional)</span>}
      </label>
      <input
        id={`checkout-${key}`}
        className="input-campo"
        name={key}
        autoComplete={autoComplete}
        type={type}
        value={data[key]}
        required={required}
        maxLength={key === "cep" ? 9 : 200}
        inputMode={
          key === "cep" ? "numeric" : type === "tel" ? "tel" : undefined
        }
        onChange={(e) =>
          update(
            key,
            key === "cep" ? formatCep(e.target.value) : e.target.value,
          )
        }
        aria-invalid={key === "cep" && shipping.invalid ? true : undefined}
        aria-describedby={key === "cep" ? "checkout-cep-note" : undefined}
      />
    </div>
  );
  return (
    <div className="container-pagina commerce-page">
      <header className="page-heading">
        <h1>Quase à sua mesa.</h1>
        <p>
          Seus dados de entrega, com calma.
          <br />
          Os detalhes finais, em uma conversa.
        </p>
      </header>
      <nav className="checkout-steps" aria-label="Etapas do pedido">
        <Link href="/carrinho">1. Sua cesta</Link>
        <span aria-current="step">2. Entrega</span>
        <span>3. WhatsApp</span>
      </nav>
      <form onSubmit={submit} className="commerce-layout">
        <div className="checkout-fields">
          {error && (
            <div
              className="form-status"
              role="alert"
              tabIndex={-1}
              ref={errorRef}
            >
              {error}
              <div>
                <Link className="text-link" href="/catalogo">
                  Revisar catálogo <Icon name="arrow" />
                </Link>
              </div>
            </div>
          )}
          <section>
            <h2>Quem vai receber?</h2>
            <div className="form-grid">
              {field("nome", "Nome completo", "name", "text", true, true)}
              {field("email", "E-mail", "email", "email")}
              {field("telefone", "WhatsApp / telefone", "tel", "tel")}
            </div>
          </section>
          <section>
            <h2>Onde será a entrega?</h2>
            <div className="form-grid">
              {field("cep", "CEP", "postal-code")}
              <div className="form-field">
                <p
                  id="checkout-cep-note"
                  className={shipping.invalid ? "field-error" : "field-note"}
                  role="status"
                >
                  {shipping.loading
                    ? "Buscando seu endereço…"
                    : shipping.message ||
                      shipping.location ||
                      "Informe oito números. Você pode ajustar o endereço abaixo."}
                </p>
              </div>
              {field(
                "logradouro",
                "Rua / avenida",
                "address-line1",
                "text",
                true,
                true,
              )}
              {field("numero", "Número", "off")}
              {field(
                "complemento",
                "Complemento",
                "address-line2",
                "text",
                false,
              )}
              {field("bairro", "Bairro", "address-level3", "text", true, true)}
            </div>
          </section>
        </div>
        <aside className="order-summary">
          <h2>Sua seleção</h2>
          <ul className="summary-items">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.quantidade} × {item.nome}
                </span>
                <span>{money(item.preco * item.quantidade)}</span>
              </li>
            ))}
          </ul>
          <dl>
            <div>
              <dt>Subtotal · {totalItens} itens</dt>
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
                {shipping.frete === null ? "Subtotal sem frete" : "Total"}
              </dt>
              <dd>{money(valorTotal + (shipping.frete || 0))}</dd>
            </div>
          </dl>
          <button
            type="submit"
            className="btn-primario"
            disabled={submitting || shipping.loading || shipping.frete === null}
            aria-busy={submitting}
          >
            {submitting ? "Registrando pedido…" : "Registrar meu pedido"}
            <Icon name="arrow" />
          </button>
          <p className="order-note">
            Depois, você continua no WhatsApp. O pagamento e a entrega são
            combinados diretamente com a loja.
          </p>
          <Link className="text-link mt-4" href="/carrinho">
            Revisar minha cesta
          </Link>
        </aside>
      </form>
    </div>
  );
}
