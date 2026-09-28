import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CardProduto } from "@/components/card-produto";
import { CatalogEmpty } from "@/components/catalog-empty";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icon";
import { getCatalog } from "@/lib/catalog";
import { WHATSAPP_URL } from "@/lib/store";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Bolachas artesanais em Curitiba — Loja da Madrinha",
  description:
    "Um pequeno ritual. Muito sabor. Conheça as bolachas artesanais da Madrinha e escolha sua seleção.",
};
export default async function PaginaHome() {
  const { products, unavailable } = await getCatalog();
  return (
    <>
      <Hero />
      <div className="promise-strip">
        <span>
          <Icon name="leaf" /> O cuidado de fazer à mão
        </span>
        <span>
          <Icon name="gift" /> Para você ou para presentear
        </span>
        <span>
          <Icon name="chat" /> Atendimento próximo, de verdade
        </span>
      </div>
      <section id="selecao" className="section-space container-pagina">
        <Reveal>
          <div className="section-heading">
            <div>
              <h2>
                Qual vai ser
                <br />
                <em>a sua pausa?</em>
              </h2>
              <p>Escolha um sabor. Encontre um novo favorito.</p>
            </div>
            <Link href="/catalogo" className="text-link">
              Conhecer todas <Icon name="arrow" />
            </Link>
          </div>
        </Reveal>
        {products.length ? (
          <div className="product-grid editorial-grid">
            {products.slice(0, 3).map((p) => (
              <Reveal key={p.id}>
                <CardProduto produto={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <CatalogEmpty unavailable={unavailable} />
        )}
      </section>
      <section id="historia" className="story-section">
        <div className="container-pagina story-grid">
          <Reveal className="story-photo">
            <Image
              src="/uploads/1779220847500-Bolachas.jpg"
              alt="Bolachas de chocolate da Madrinha, com detalhes moldados artesanalmente"
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
            />
            <span>Da nossa cozinha, com carinho.</span>
          </Reveal>
          <Reveal className="story-copy">
            <h2>
              Tem coisas que
              <br />a gente sente
              <br />
              <em>no primeiro pedaço.</em>
            </h2>
            <p>
              A textura, o desenho, o cuidado em cada detalhe. Nossas bolachas
              carregam o encanto das coisas feitas à mão.
            </p>
            <p>
              Na Madrinha, a mesa é um convite: para uma pausa no dia, uma
              conversa boa ou um presente cheio de significado.
            </p>
            <a
              className="text-link"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Vamos conversar? <Icon name="arrow" />
            </a>
          </Reveal>
        </div>
      </section>
      <section className="selection-section container-pagina">
        <Reveal>
          <div className="selection-layout">
            <div className="selection-symbol">
              <Icon name="gift" width="64" height="64" />
            </div>
            <h2>
              Do seu jeito.
              <br />
              <em>Com o nosso carinho.</em>
            </h2>
            <div>
              <p>
                Junte seus favoritos em uma seleção especial. Para dividir,
                presentear ou guardar aquele momento só para você.
              </p>
              <Link href="/monte-sua-caixa" className="btn-primario">
                Montar minha seleção <Icon name="arrow" />
              </Link>
              <span className="small-note">
                Embalagens especiais? Combine com a Madrinha.
              </span>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="home-questions container-pagina">
        <h2>Antes da primeira mordida.</h2>
        <div>
          <details>
            <summary>Como faço meu pedido?</summary>
            <p>
              Escolha suas bolachas, confira a cesta e preencha os dados de
              entrega. Depois de registrar o pedido, você continua no WhatsApp
              para combinar o pagamento e os detalhes finais.
            </p>
          </details>
          <details>
            <summary>Como funciona a entrega?</summary>
            <p>
              A loja fica em Curitiba. Consulte o frete pelo CEP na cesta e
              confirme a disponibilidade e o prazo com a Madrinha pelo WhatsApp.
            </p>
          </details>
          <details>
            <summary>Posso fazer uma encomenda especial?</summary>
            <p>
              Sim. Para presentes, eventos e embalagens especiais, converse com
              a Madrinha para confirmar formatos, prazos e valores.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
