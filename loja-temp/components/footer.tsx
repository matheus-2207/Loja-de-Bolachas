export function Footer() {
  const anoAtual = new Date().getFullYear()

  return (
    <footer className="bg-biscoito-900 text-biscoito-100 mt-auto py-8">
      <div className="container-pagina text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl" aria-hidden="true">🍪</span>
          <span className="font-display font-bold text-lg text-white">Loja da Madrinha</span>
        </div>
        <p className="text-sm text-biscoito-300">
          Bolachas artesanais feitas com carinho. Ingredientes selecionados, sabor de casa.
        </p>
        <div className="mt-6 pt-6 border-t border-biscoito-700 text-xs text-biscoito-400">
          <p>© {anoAtual} Loja da Madrinha. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
