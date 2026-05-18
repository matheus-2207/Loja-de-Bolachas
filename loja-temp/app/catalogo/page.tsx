import type { Metadata } from 'next'
import { CardProduto } from '@/components/card-produto'

export const metadata: Metadata = {
  title: 'Catálogo de Bolachas — Loja da Madrinha',
  description: 'Confira todos os nossos sabores de bolachas artesanais.',
}

// Produtos mockados (iguais aos da home, com alguns extras para popular a grade)
const produtosCatalogo = [
  { id: '1', nome: 'Bolacha de Manteiga Clássica', descricao: 'A receita da vovó, crocante por fora e macia por dentro.', preco: 18.90 },
  { id: '2', nome: 'Bolacha de Chocolate', descricao: 'Com gotas de chocolate meio amargo belga. Irresistível!', preco: 22.90 },
  { id: '3', nome: 'Bolacha de Limão Siciliano', descricao: 'Refrescante e cítrica, perfeita para o acompanhamento do seu chá da tarde.', preco: 20.90 },
  { id: '4', nome: 'Caixa Mista (12 unid.)', descricao: 'Sortido com os melhores sabores artesanais da Loja da Madrinha.', preco: 54.90 },
  { id: '5', nome: 'Bolacha de Canela', descricao: 'O sabor acolhedor da canela em uma bolacha que derrete na boca.', preco: 19.90 },
  { id: '6', nome: 'Bolacha de Morango', descricao: 'Com recheio artesanal de morango e uma pitada de amor.', preco: 24.90 },
]

export default function PaginaCatalogo() {
  return (
    <div className="container-pagina py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-biscoito-900 mb-4">
          Nosso Catálogo 🍪
        </h1>
        <p className="text-biscoito-600 text-lg max-w-2xl mx-auto">
          Escolha suas bolachas favoritas. Feitas fresquinhas todos os dias para você!
        </p>
      </div>

      {/* Grid de 3 colunas no desktop, 2 no tablet, 1 no mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {produtosCatalogo.map((produto) => (
          <CardProduto key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  )
}
