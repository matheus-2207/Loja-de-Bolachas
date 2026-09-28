import type { Metadata } from "next";
import Link from "next/link";
import { CardProduto } from "@/components/card-produto";
import { CatalogEmpty } from "@/components/catalog-empty";
import { getCatalog } from "@/lib/catalog";
import { Icon } from "@/components/icon";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Nossas bolachas",
  description:
    "Descubra os sabores da Madrinha e encontre sua próxima pausa favorita.",
};
export default async function PaginaCatalogo({
  searchParams,
}: {
  searchParams: { categoria?: string; busca?: string };
}) {
  const { products, unavailable } = await getCatalog();
  const categories = Array.from(
    new Set(products.map((p) => p.categoria).filter((c): c is string => !!c)),
  );
  const category = searchParams.categoria || "";
  const search = searchParams.busca?.trim() || "";
  const filtered = products.filter(
    (p) =>
      (!category || p.categoria === category) &&
      (!search ||
        `${p.nome} ${p.descricao || ""}`
          .toLocaleLowerCase("pt-BR")
          .includes(search.toLocaleLowerCase("pt-BR"))),
  );
  return (
    <div className="container-pagina catalog-page">
      <header className="page-heading">
        <h1>
          Nossas bolachas.
          <br />
          <em>Seu próximo ritual.</em>
        </h1>
        <p>
          O cuidado artesanal em cada detalhe.
          <br />
          Escolha o que combina com o seu momento.
        </p>
      </header>
      <div className="catalog-toolbar">
        <nav aria-label="Categorias" className="category-nav">
          <Link
            href={
              search
                ? `/catalogo?busca=${encodeURIComponent(search)}`
                : "/catalogo"
            }
            aria-current={!category ? "page" : undefined}
          >
            Todas
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/catalogo?categoria=${encodeURIComponent(cat)}${search ? `&busca=${encodeURIComponent(search)}` : ""}`}
              aria-current={category === cat ? "page" : undefined}
            >
              {cat}
            </Link>
          ))}
        </nav>
        <form role="search" className="catalog-search">
          <label htmlFor="busca" className="sr-only">
            Buscar bolachas
          </label>
          {category && (
            <input type="hidden" name="categoria" value={category} />
          )}
          <input
            id="busca"
            name="busca"
            type="search"
            defaultValue={search}
            placeholder="Encontre seu sabor"
          />
          <button type="submit" className="icon-button" aria-label="Buscar">
            <Icon name="arrow" />
          </button>
        </form>
      </div>
      <div className="catalog-count" aria-live="polite">
        {unavailable
          ? "Catálogo temporariamente indisponível"
          : `${filtered.length} ${filtered.length === 1 ? "produto" : "produtos"}`}
        {search && <Link href="/catalogo">Limpar busca</Link>}
      </div>
      {filtered.length ? (
        <section className="product-grid" aria-label="Produtos">
          {filtered.map((p) => (
            <CardProduto key={p.id} produto={p} />
          ))}
        </section>
      ) : (
        <CatalogEmpty
          unavailable={unavailable}
          filtered={!!(category || search)}
        />
      )}
      <aside className="catalog-help">
        <Icon name="gift" />
        <p>Uma seleção com a sua cara.</p>
        <Link className="text-link" href="/monte-sua-caixa">
          Junte seus favoritos <Icon name="arrow" />
        </Link>
      </aside>
    </div>
  );
}
