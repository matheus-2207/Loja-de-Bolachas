import { shippingForCep } from "@/lib/store";
export interface OrderInput {
  nomeCliente: string;
  emailCliente: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  itens: { produtoId: string; quantidade: number; preco: number }[];
  frete: number;
  total: number;
}
export class OrderError extends Error {}
export function validateOrderInput(dados: OrderInput) {
  if (
    !dados ||
    [
      "nomeCliente",
      "emailCliente",
      "telefone",
      "cep",
      "logradouro",
      "numero",
      "bairro",
    ].some(
      (key) =>
        typeof dados[key as keyof OrderInput] !== "string" ||
        !(dados[key as keyof OrderInput] as string).trim() ||
        (dados[key as keyof OrderInput] as string).length > 200,
    )
  )
    throw new OrderError("Confira os dados obrigatórios de contato e entrega.");
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.emailCliente) ||
    dados.telefone.replace(/\D/g, "").length < 10 ||
    dados.cep.replace(/\D/g, "").length !== 8
  )
    throw new OrderError(
      "Confira o e-mail, o telefone e os oito números do CEP.",
    );
  if (
    dados.complemento &&
    (typeof dados.complemento !== "string" || dados.complemento.length > 200)
  )
    throw new OrderError("Confira o complemento do endereço.");
  if (
    !Array.isArray(dados.itens) ||
    !dados.itens.length ||
    dados.itens.length > 100 ||
    dados.itens.some(
      (p) =>
        !p ||
        typeof p.produtoId !== "string" ||
        !p.produtoId ||
        !Number.isSafeInteger(p.quantidade) ||
        p.quantidade < 1 ||
        !Number.isFinite(p.preco) ||
        p.preco < 0,
    )
  )
    throw new OrderError(
      "Sua cesta contém uma quantidade inválida. Revise os produtos.",
    );
  if (new Set(dados.itens.map((p) => p.produtoId)).size !== dados.itens.length)
    throw new OrderError(
      "Há produtos repetidos na cesta. Remova-os e adicione novamente.",
    );
}
export function validateOrderPrices(
  dados: OrderInput,
  products: {
    id: string;
    nome: string;
    preco: number;
    estoque: number;
    ativo: boolean;
  }[],
) {
  let subtotalCents = 0;
  for (const item of dados.itens) {
    const product = products.find((p) => p.id === item.produtoId);
    if (!product || !product.ativo)
      throw new OrderError(
        "Um produto não está mais disponível. Revise sua cesta no catálogo.",
      );
    if (product.estoque < item.quantidade)
      throw new OrderError(
        `O estoque de ${product.nome} mudou. Há ${product.estoque} unidades disponíveis. Revise sua cesta.`,
      );
    if (Math.round(item.preco * 100) !== Math.round(product.preco * 100))
      throw new OrderError(
        `O preço de ${product.nome} mudou. Remova o produto da cesta e adicione novamente pelo catálogo.`,
      );
    subtotalCents += Math.round(product.preco * 100) * item.quantidade;
  }
  const frete = shippingForCep(dados.cep);
  const total = (subtotalCents + frete * 100) / 100;
  if (
    !Number.isFinite(dados.total) ||
    !Number.isFinite(dados.frete) ||
    Math.round(dados.total * 100) !== Math.round(total * 100) ||
    dados.frete !== frete
  )
    throw new OrderError(
      "Os valores do pedido mudaram. Atualize sua cesta antes de continuar.",
    );
  return { frete, total };
}
