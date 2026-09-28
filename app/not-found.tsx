import Link from "next/link";
import { Icon } from "@/components/icon";
export default function NotFound() {
  return (
    <div className="container-pagina state-panel">
      <Icon name="basket" />
      <h1>Essa página saiu da mesa.</h1>
      <p>
        O produto ou a página que você procura não está disponível. Nosso
        catálogo tem outros bons encontros.
      </p>
      <Link href="/catalogo" className="btn-primario">
        Ver nossas bolachas <Icon name="arrow" />
      </Link>
    </div>
  );
}
