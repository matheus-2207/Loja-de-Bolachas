"use client";
import { WHATSAPP_URL } from "@/lib/store";
import { Icon } from "@/components/icon";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container-pagina state-panel">
      <Icon name="chat" />
      <h1>Uma pequena pausa.</h1>
      <p>
        Não foi possível carregar esta página agora. Tente novamente ou converse
        com a Madrinha para continuar seu pedido.
      </p>
      <div className="state-actions">
        <button onClick={reset} className="btn-primario">
          Tentar novamente
        </button>
        <a
          href={WHATSAPP_URL}
          className="btn-secundario"
          target="_blank"
          rel="noopener noreferrer"
        >
          Falar com a loja
        </a>
      </div>
    </div>
  );
}
