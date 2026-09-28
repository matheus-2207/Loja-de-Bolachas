"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WHATSAPP_URL } from "@/lib/store";
import { Icon } from "@/components/icon";
export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="site-footer">
      <div className="container-pagina">
        <div className="footer-top">
          <div>
            <Link href="/" className="footer-wordmark">
              Madrinha.
            </Link>
            <p>
              Pequenos momentos.
              <br />
              Boas lembranças à mesa.
            </p>
          </div>
          <nav aria-label="Links do rodapé">
            <Link href="/catalogo">Nossas bolachas</Link>
            <Link href="/monte-sua-caixa">Monte sua seleção</Link>
            <Link href="/carrinho">Sua cesta</Link>
          </nav>
          <div className="footer-contact">
            <p>De Curitiba, com carinho.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Converse com a Madrinha <Icon name="arrow" />
            </a>
            <span>(41) 99655-0283</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Loja da Madrinha</span>
          <span>Bolachas artesanais · Curitiba, PR</span>
          <a href="#conteudo">Voltar ao início ↑</a>
        </div>
      </div>
    </footer>
  );
}
