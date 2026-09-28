import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { ProductDetail } from "@/components/product-detail";
import { CardProduto } from "@/components/card-produto";
import { CatalogEmpty } from "@/components/catalog-empty";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { products } = await getCatalog();
  const p = products.find((p) => p.id === params.id);
  return {
    title: p?.nome || "Nossas bolachas",
    description:
      p?.descricao || "Conheça os detalhes das bolachas da Madrinha.",
  };
}
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { products, unavailable } = await getCatalog();
  if (unavailable)
    return (
      <div className="container-pagina section-space">
        <CatalogEmpty unavailable />
      </div>
    );
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  return (
    <div className="container-pagina">
      <nav className="breadcrumb" aria-label="Caminho da página">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/catalogo">Nossas bolachas</Link>
        <span>/</span>
        <span aria-current="page">{product.nome}</span>
      </nav>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="related-section">
          <h2>Outros bons encontros.</h2>
          <div className="product-grid">
            {related.map((p) => (
              <CardProduto key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
