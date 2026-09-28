import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/store";
import { Icon } from "@/components/icon";
export function CatalogEmpty({
  unavailable = false,
  filtered = false,
}: {
  unavailable?: boolean;
  filtered?: boolean;
}) {
  return (
    <div className="catalog-empty">
      <Icon name={unavailable ? "chat" : "basket"} />
      <div>
        <h3>
          {unavailable
            ? "Nossa seleção está sendo atualizada."
            : filtered
              ? "Nenhuma bolacha nesta seleção."
              : "Uma nova fornada vem aí."}
        </h3>
        <p>
          {unavailable
            ? "Não foi possível carregar o catálogo agora. Consulte os sabores e a disponibilidade diretamente com a Madrinha."
            : filtered
              ? "Experimente outra categoria ou veja todos os produtos."
              : "Consulte a disponibilidade e combine sua encomenda com a Madrinha."}
        </p>
      </div>
      {filtered ? (
        <Link className="text-link" href="/catalogo">
          Ver todas as bolachas <Icon name="arrow" />
        </Link>
      ) : (
        <a
          className="text-link"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Conversar com a Madrinha <Icon name="arrow" />
        </a>
      )}
    </div>
  );
}
