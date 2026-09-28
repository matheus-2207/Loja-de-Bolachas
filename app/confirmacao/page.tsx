import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/icon";
import { WHATSAPP_URL, money } from "@/lib/store";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Seu pedido",
  robots: { index: false, follow: false },
};
const statuses: Record<string, string> = {
  PENDENTE: "Aguardando confirmação",
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
  PAGO: "Pago",
  EM_PREPARO: "Em preparo",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};
export default async function Confirmation({
  searchParams,
}: {
  searchParams: { pedidoId?: string };
}) {
  if (!searchParams.pedidoId) notFound();
  const pedido = await prisma.pedido.findUnique({
    where: { id: searchParams.pedidoId },
    include: { itens: { include: { produto: true } } },
  });
  if (!pedido) notFound();
  return (
    <div className="container-pagina commerce-page">
      <header className="page-heading">
        <h1>
          Um bom momento
          <br />
          <em>está a caminho.</em>
        </h1>
        <p>
          Pedido {pedido.id}
          <br />
          {statuses[pedido.status] || "Aguardando confirmação"}
        </p>
      </header>
      <div className="commerce-layout">
        <section className="checkout-fields">
          <h2 className="mb-6">Sua seleção</h2>
          <ul className="cart-list">
            {pedido.itens.map((item) => (
              <li
                key={item.id}
                className="flex justify-between gap-5 py-5 border-b border-biscoito-200"
              >
                <span>
                  {item.quantidade} × {item.produto.nome}
                </span>
                <span className="preco whitespace-nowrap">
                  {money(Number(item.preco) * item.quantidade)}
                </span>
              </li>
            ))}
          </ul>
          <p className="field-note mt-6">
            Os detalhes de pagamento e entrega são confirmados diretamente com a
            Madrinha pelo WhatsApp.
          </p>
        </section>
        <aside className="order-summary">
          <h2>Pedido registrado.</h2>
          <dl>
            <div>
              <dt>Frete</dt>
              <dd>{money(Number(pedido.frete))}</dd>
            </div>
            <div className="summary-total">
              <dt>Total</dt>
              <dd>{money(Number(pedido.total))}</dd>
            </div>
          </dl>
          <a
            className="btn-primario"
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Olá! Gostaria de confirmar os detalhes do pedido ${pedido.id}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Conversar com a Madrinha <Icon name="arrow" />
          </a>
          <p className="order-note">
            Confirme a disponibilidade e o prazo de entrega com a loja.
          </p>
          <Link href="/catalogo" className="text-link mt-4">
            Voltar às bolachas
          </Link>
        </aside>
      </div>
    </div>
  );
}
