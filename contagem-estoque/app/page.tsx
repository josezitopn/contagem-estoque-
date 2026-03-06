'use client'

import React, { useEffect, useMemo, useState } from 'react'
import BottomNav, { Tab } from '@/components/BottomNav'
import ScannerModal from '@/components/ScannerModal'
import { Button, Card, Input, Label, Pill, Textarea } from '@/components/ui'
import { CountItem } from '@/components/types'
import { downloadCSV, loadItems, saveItems } from '@/components/storage'
import { uid } from '@/components/id'

export default function Home() {
  const [tab, setTab] = useState<Tab>('contagem')
  const [items, setItems] = useState<CountItem[]>([])

  const [produto, setProduto] = useState('')
  const [endereco, setEndereco] = useState('')
  const [quantidade, setQuantidade] = useState<number>(0)
  const [validade, setValidade] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [scanOpen, setScanOpen] = useState(false)
  const [scanMode, setScanMode] = useState<'product' | 'address'>('product')

  useEffect(() => setItems(loadItems()), [])
  useEffect(() => saveItems(items), [items])

  const total = useMemo(() => items.reduce((acc, it) => acc + (Number(it.quantidade) || 0), 0), [items])

  const addItem = () => {
    if (!produto.trim()) return alert('Informe o código do produto (ou escaneie).')
    if (!endereco.trim()) return alert('Informe o endereço/localização (ou escaneie o QR).')
    const q = Number(quantidade)
    if (!Number.isFinite(q) || q <= 0) return alert('Quantidade deve ser maior que zero.')

    const it: CountItem = {
      id: uid(),
      produto: produto.trim(),
      endereco: endereco.trim(),
      quantidade: q,
      validade: validade || undefined,
      observacoes: observacoes || undefined,
      createdAt: new Date().toISOString(),
    }

    setItems((prev) => [it, ...prev])
    setQuantidade(0)
    setObservacoes('')
  }

  const removeItem = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id))
  const clearAll = () => confirm('Apagar todas as contagens?') && setItems([])

  const Header = () => (
    <header className="max-w-md mx-auto px-4 pt-6 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-stroke flex items-center justify-center">📶</div>
        <div>
          <div className="text-lg font-semibold">Contagem Estoque</div>
          <div className="text-xs text-white/60">Rápido, simples e exporta em CSV</div>
        </div>
      </div>
    </header>
  )

  const ScreenContagem = () => (
    <main className="max-w-md mx-auto px-4 pb-28">
      <Card title="Registrar Contagem" icon={<span className="text-blue-300">📦</span>}>
        <div className="space-y-4">
          <div>
            <Label>Código de Barras do Produto</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                className="col-span-2"
                variant="ghost"
                onClick={() => {
                  setScanMode('product')
                  setScanOpen(true)
                }}
              >
                📷 Escanear Produto
              </Button>
              <Button type="button" variant="ghost" onClick={() => document.getElementById('produto')?.focus()}>
                ⌨️ Digitar
              </Button>
            </div>
            <div className="mt-3">
              <Input id="produto" placeholder="Digite ou escaneie o código" value={produto} onChange={(e) => setProduto(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Endereço / Localização</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                className="col-span-2"
                variant="ghost"
                onClick={() => {
                  setScanMode('address')
                  setScanOpen(true)
                }}
              >
                📷 Endereço QR Escanear
              </Button>
              <Button type="button" variant="ghost" onClick={() => document.getElementById('endereco')?.focus()}>
                ⌨️ Digitar
              </Button>
            </div>
            <div className="mt-3">
              <Input id="endereco" placeholder="Ou digite o endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Quantidade *</Label>
              <Input inputMode="numeric" value={String(quantidade)} onChange={(e) => setQuantidade(Number(e.target.value))} />
            </div>
            <div>
              <Label>Validade</Label>
              <Input placeholder="YYYY-MM-DD" value={validade} onChange={(e) => setValidade(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea placeholder="uma observação..." value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
          </div>

          <Button type="button" className="w-full" onClick={addItem}>
            ➕ Salvar Contagem
          </Button>
        </div>
      </Card>

      <div className="mt-4 rounded-xl bg-card/40 border border-stroke p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Resumo</div>
          <div className="flex gap-2">
            <Pill>{items.length} itens</Pill>
            <Pill>Total: {total}</Pill>
          </div>
        </div>
        <div className="mt-3 flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={() => downloadCSV(items)}>
            ⬇️ Exportar CSV
          </Button>
          <Button type="button" variant="ghost" className="flex-1" onClick={clearAll}>
            🗑️ Limpar
          </Button>
        </div>
      </div>

      <ScannerModal
        open={scanOpen}
        mode={scanMode}
        onClose={() => setScanOpen(false)}
        onResult={(value) => {
          if (scanMode === 'product') setProduto(value)
          else setEndereco(value)
        }}
      />
    </main>
  )

  const ScreenProdutos = () => (
    <main className="max-w-md mx-auto px-4 pb-28">
      <Card title="Produtos" icon={<span className="text-blue-300">📦</span>}>
        <div className="text-sm text-white/70">Aba opcional (catálogo). Posso adicionar importação de produtos por CSV depois.</div>
      </Card>
    </main>
  )

  const ScreenHistorico = () => (
    <main className="max-w-md mx-auto px-4 pb-28">
      <Card title="Histórico" icon={<span className="text-blue-300">🧾</span>}>
        {items.length === 0 ? (
          <div className="text-sm text-white/70">Nenhuma contagem registrada ainda.</div>
        ) : (
          <div className="space-y-3">
            {items.slice(0, 50).map((it) => (
              <div key={it.id} className="rounded-xl bg-card2 border border-stroke p-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{it.produto}</div>
                  <button className="text-white/60 hover:text-white" onClick={() => removeItem(it.id)} title="Remover">
                    🗑️
                  </button>
                </div>
                <div className="text-sm text-white/70 mt-1">Endereço: {it.endereco}</div>
                <div className="flex gap-2 mt-2">
                  <Pill>Qtd: {it.quantidade}</Pill>
                  {it.validade && <Pill>Val: {it.validade}</Pill>}
                </div>
                {it.observacoes && <div className="text-sm text-white/70 mt-2">Obs: {it.observacoes}</div>}
                <div className="text-xs text-white/50 mt-2">{new Date(it.createdAt).toLocaleString('pt-BR')}</div>
              </div>
            ))}
            {items.length > 50 && <div className="text-xs text-white/60">Mostrando 50 mais recentes. Exporte CSV para ver tudo.</div>}
          </div>
        )}
        <div className="mt-4 flex gap-3">
          <Button type="button" className="flex-1" variant="ghost" onClick={() => downloadCSV(items)}>
            ⬇️ Exportar CSV
          </Button>
          <Button type="button" className="flex-1" variant="ghost" onClick={clearAll}>
            🗑️ Limpar
          </Button>
        </div>
      </Card>
    </main>
  )

  const ScreenConfig = () => (
    <main className="max-w-md mx-auto px-4 pb-28">
      <Card title="Configuração" icon={<span className="text-blue-300">⚙️</span>}>
        <div className="space-y-3 text-sm text-white/70">
          <div>
            <div className="font-semibold text-white">Exportação</div>
            <div>O CSV é separado por <b>;</b> (padrão Excel BR). Se quiser por vírgula, posso ajustar.</div>
          </div>
          <div>
            <div className="font-semibold text-white">Instalar como App (PWA)</div>
            <div>Android/Chrome: menu ⋮ → <b>Instalar app</b>. iPhone/Safari: Compartilhar → <b>Adicionar à Tela de Início</b>.</div>
          </div>
        </div>
      </Card>
    </main>
  )

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      {tab === 'contagem' && <ScreenContagem />}
      {tab === 'produtos' && <ScreenProdutos />}
      {tab === 'historico' && <ScreenHistorico />}
      {tab === 'config' && <ScreenConfig />}
      <BottomNav tab={tab} onTab={setTab} />
    </div>
  )
}
