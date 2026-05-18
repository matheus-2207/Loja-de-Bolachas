# Projeto: Loja da Madrinha 🍪

## Contexto
Site de vendas de bolachas artesanais. Clientela local (Curitiba/BR).
Dona do negócio não é técnica — o admin precisa ser simples.

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Prisma + PostgreSQL
- Mercado Pago SDK (PIX + cartão)
- Cloudinary (imagens)
- Deploy na Vercel

## Padrões de código
- TypeScript em tudo
- Componentes em /components, páginas em /app
- Nomear arquivos em kebab-case
- Comentários em português
- Nunca commitar .env

## Regras de negócio
- Preços sempre em BRL (R$)
- Pedido mínimo: definir com a dona
- Frete: calcular por CEP via ViaCEP + regra fixa por bairro
- Após pagamento confirmado: enviar e-mail de confirmação

## O que NÃO fazer
- Não usar nenhuma biblioteca de UI pesada (MUI, Chakra)
- Não criar lógica complexa no admin — manter simples
- Não armazenar dados de cartão — tudo via Mercado Pago