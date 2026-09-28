export const WHATSAPP_NUMBER = "5541996550283";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
export const shippingForCep = (cep: string) =>
  cep.replace(/\D/g, "").startsWith("8") ? 8 : 15;

export interface StoreProduct {
  id: string;
  nome: string;
  descricao?: string | null;
  categoria?: string | null;
  preco: number;
  imagem?: string | null;
  estoque: number;
}
