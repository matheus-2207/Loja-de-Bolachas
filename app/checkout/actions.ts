"use server";
import { prisma } from "@/lib/prisma";
import {
  OrderError,
  validateOrderInput,
  validateOrderPrices,
  type OrderInput,
} from "@/lib/order-validation";
export type CriarPedidoInput = OrderInput;
export async function criarPedido(dados: CriarPedidoInput) {
  try {
    validateOrderInput(dados);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof OrderError
          ? error.message
          : "Confira os dados do pedido.",
    };
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const pedido = await prisma.$transaction(
        async (tx) => {
          const products = await tx.produto.findMany({
            where: { id: { in: dados.itens.map((p) => p.produtoId) } },
          });
          const { frete, total } = validateOrderPrices(
            dados,
            products.map((p) => ({ ...p, preco: Number(p.preco) })),
          );
          const latest = await tx.pedido.findFirst({
            where: { id: { startsWith: "LM-" } },
            orderBy: { createdAt: "desc" },
          });
          const match = latest?.id.match(/^LM-(\d+)$/);
          const id = `LM-${String(match ? Number(match[1]) + 1 : 1).padStart(5, "0")}`;
          for (const item of dados.itens) {
            const result = await tx.produto.updateMany({
              where: {
                id: item.produtoId,
                ativo: true,
                estoque: { gte: item.quantidade },
              },
              data: { estoque: { decrement: item.quantidade } },
            });
            if (result.count !== 1)
              throw new OrderError(
                "O estoque mudou durante a compra. Revise sua cesta e tente novamente.",
              );
          }
          return tx.pedido.create({
            data: {
              id,
              nomeCliente: dados.nomeCliente.trim(),
              emailCliente: dados.emailCliente.trim(),
              telefone: dados.telefone.trim(),
              cep: dados.cep.replace(/\D/g, ""),
              logradouro: `${dados.logradouro.trim()}, ${dados.numero.trim()}${dados.complemento?.trim() ? " - " + dados.complemento.trim() : ""}`,
              bairro: dados.bairro.trim(),
              frete,
              total,
              status: "PENDENTE",
              itens: {
                create: dados.itens.map((item) => ({
                  produtoId: item.produtoId,
                  quantidade: item.quantidade,
                  preco: products.find((p) => p.id === item.produtoId)!.preco,
                })),
              },
            },
          });
        },
        { isolationLevel: "Serializable" },
      );
      return { success: true, pedidoId: pedido.id };
    } catch (error) {
      if (error instanceof OrderError)
        return { success: false, error: error.message };
      const code =
        error && typeof error === "object" && "code" in error
          ? error.code
          : undefined;
      if ((code === "P2034" || code === "P2002") && attempt < 2) continue;
      console.error(
        "Não foi possível registrar o pedido.",
        code || "conexão indisponível",
      );
      return {
        success: false,
        error:
          "Não foi possível confirmar o registro. Sua cesta foi mantida. Consulte a loja antes de tentar novamente.",
      };
    }
  }
  return {
    success: false,
    error:
      "A loja está recebendo outros pedidos. Tente novamente em instantes.",
  };
}
