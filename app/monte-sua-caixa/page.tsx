import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { BoxBuilder } from "@/components/box-builder";
import { CatalogEmpty } from "@/components/catalog-empty";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Monte sua seleção",
  description: "Reúna suas bolachas favoritas em uma seleção do seu jeito.",
};
export default async function SelectionPage() {
  const { products, unavailable } = await getCatalog();
  return (
    <div className="container-pagina commerce-page">
      <header className="page-heading">
        <h1>
          Seus favoritos.
          <br />
          <em>Juntos, do seu jeito.</em>
        </h1>
        <p>
          Escolha os produtos e as quantidades.
          <br />O carinho já faz parte da seleção.
        </p>
      </header>
      {products.length ? (
        <BoxBuilder products={products} />
      ) : (
        <CatalogEmpty unavailable={unavailable} />
      )}
    </div>
  );
}
