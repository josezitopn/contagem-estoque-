import { CountItem } from './types'

const KEY = 'contagem_estoque_itens_v1'

export function loadItems(): CountItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as CountItem[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function saveItems(items: CountItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function toCSV(items: CountItem[]) {
  const header = ['produto', 'endereco', 'quantidade', 'validade', 'observacoes', 'createdAt']
  const escape = (v: unknown) => {
    const s = (v ?? '').toString()
    if (/[",\n;]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }
  const lines = [header.join(';')]
  for (const it of items) {
    lines.push(
      [
        escape(it.produto),
        escape(it.endereco),
        escape(it.quantidade),
        escape(it.validade ?? ''),
        escape(it.observacoes ?? ''),
        escape(it.createdAt),
      ].join(';')
    )
  }
  return lines.join('\n')
}

export function downloadCSV(items: CountItem[]) {
  const csv = toCSV(items)
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const now = new Date()
  const stamp = now.toISOString().slice(0, 19).replace(/[:T]/g, '-')
  a.href = url
  a.download = `contagens-${stamp}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
