import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { StoreProduct } from "@/lib/store";
import { productImage } from "@/lib/product-imagery";

export const getCatalog = cache(
  async (): Promise<{ products: StoreProduct[]; unavailable: boolean }> => {
    try {
      const products = await prisma.produto.findMany({
        where: { ativo: true },
        orderBy: { createdAt: "desc" },
      });
      return {
        products: products.map((p) => ({
          id: p.id,
          nome: p.nome.trim(),
          descricao: p.descricao,
          categoria: p.categoria,
          preco: Number(p.preco),
          imagem: productImage(p.nome, p.imagem),
          estoque: p.estoque,
        })),
        unavailable: false,
      };
    } catch {
      console.error(
        "Catálogo temporariamente indisponível: verifique a conexão do banco de dados.",
      );
      return { products: [], unavailable: true };
    }
  },
);
