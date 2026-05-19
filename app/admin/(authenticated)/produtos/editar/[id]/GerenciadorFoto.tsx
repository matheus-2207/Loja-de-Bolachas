'use client'

import { useState } from 'react'

interface GerenciadorFotoProps {
  fotoAtual: string | null
}

export function GerenciadorFoto({ fotoAtual }: GerenciadorFotoProps) {
  const [remover, setRemover] = useState(false)

  if (!fotoAtual) {
    return (
      <input 
        type="file" 
        name="foto" 
        accept="image/*" 
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none text-sm text-gray-500" 
      />
    )
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="removerFoto" value={remover ? "true" : "false"} />
      
      {!remover ? (
        <div>
          <p className="text-xs text-gray-500 mb-1">Foto atual:</p>
          <div className="relative inline-block">
            <img 
              src={fotoAtual} 
              alt="Atual" 
              className="h-24 w-24 object-cover rounded-lg border border-gray-200 shadow-sm" 
            />
            <button
              type="button"
              onClick={() => setRemover(true)}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md transition-colors hover:scale-105"
              title="Remover foto atual"
            >
              <span className="text-sm font-bold leading-none">&times;</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-red-50/70 border border-red-100 rounded-lg p-3 flex items-center justify-between">
          <span className="text-xs text-red-600 font-medium">A foto atual será removida ao salvar.</span>
          <button
            type="button"
            onClick={() => setRemover(false)}
            className="text-xs text-biscoito-600 hover:text-biscoito-800 font-semibold hover:underline"
          >
            Desfazer
          </button>
        </div>
      )}

      <div>
        <label className="block text-xs text-gray-500 mb-1">
          {remover ? 'Adicionar nova foto:' : 'Substituir por nova foto (opcional):'}
        </label>
        <input 
          type="file" 
          name="foto" 
          accept="image/*" 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biscoito-500 outline-none text-sm text-gray-500" 
        />
      </div>
    </div>
  )
}
