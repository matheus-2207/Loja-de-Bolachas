import Link from 'next/link'
import { CardProduto } from '@/components/card-produto'

const produtosDestaque = [
  { id: '1', nome: 'Bolacha de Manteiga Clássica', descricao: 'A receita da vovó, crocante por fora e macia por dentro.', preco: 18.90 },
  { id: '2', nome: 'Bolacha de Chocolate', descricao: 'Com gotas de chocolate meio amargo belga. Irresistível!', preco: 22.90 },
  { id: '3', nome: 'Bolacha de Limão Siciliano', descricao: 'Refrescante e cítrica, perfeita para o acompanhamento do seu chá da tarde.', preco: 20.90 },
  { id: '4', nome: 'Caixa Mista (12 unid.)', descricao: 'Sortido com os melhores sabores artesanais da Loja da Madrinha.', preco: 54.90 },
]

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-biscoito-50 via-creme-100 to-biscoito-100 py-24 sm:py-32">
        <div className="absolute inset-0 pointer-events-none select-none opacity-20" aria-hidden="true">
          <span className="absolute top-10 left-10 text-8xl rotate-12">🍪</span>
          <span className="absolute bottom-10 right-10 text-9xl -rotate-12">🍪</span>
          <span className="absolute top-1/2 left-1/4 text-6xl rotate-45">🍪</span>
        </div>
        
        <div className="container-pagina relative z-10 text-center">
          <span className="inline-block bg-biscoito-200 text-biscoito-800 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            ✨ Feitas com amor
          </span>
          <h1 className="font-display font-bold text-5xl md:text-7xl text-biscoito-900 mb-6 leading-tight">
            Bolachas Artesanais <br className="hidden md:block"/>
            <span className="text-biscoito-600">da Madrinha</span>
          </h1>
          <p className="text-lg md:text-xl text-biscoito-700 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Receitas tradicionais, ingredientes selecionados e muito carinho em cada fornada. 
            A doçura que transforma o seu dia!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo" className="btn-primario text-lg px-8 py-4">
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-pagina">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-biscoito-900 mb-4">
              Destaques da Fornada
            </h2>
            <p className="text-biscoito-600 text-lg max-w-2xl mx-auto">
              Os sabores preferidos das nossas clientes. Experimente essas delícias!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {produtosDestaque.map((produto) => (
              <CardProduto 
                key={produto.id} 
                produto={{
                  ...produto,
                  estoque: 10,
                }} 
              />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/catalogo" className="btn-secundario text-lg px-8 py-3">
              Descobrir mais sabores →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
