'use client'

import React from 'react'

export type Tab = 'contagem' | 'produtos' | 'historico' | 'config'

export default function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const Item = ({ id, label, icon }: { id: Tab; label: string; icon: string }) => (
    <button onClick={() => onTab(id)} className={'flex flex-col items-center justify-center gap-1 py-2 flex-1 ' + (tab === id ? 'text-primary' : 'text-white/60')}>
      <span className="text-lg">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom bg-[#0a0e13] border-t border-stroke">
      <div className="max-w-md mx-auto flex">
        <Item id="contagem" label="Contagem" icon="📶" />
        <Item id="produtos" label="Produtos" icon="📦" />
        <Item id="historico" label="Histórico" icon="🧾" />
        <Item id="config" label="Configuração" icon="⚙️" />
      </div>
    </nav>
  )
}
