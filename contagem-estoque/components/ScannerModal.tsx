'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from './ui'

type Mode = 'product' | 'address'

export default function ScannerModal({ open, mode, onClose, onResult }: { open: boolean; mode: Mode; onClose: () => void; onResult: (value: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const formats = useMemo(() => (mode === 'address' ? ['qr_code'] : ['code_128', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code']), [mode])

  useEffect(() => {
    if (!open) return

    const start = async () => {
      setError(null)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        // @ts-ignore
        const BD = (window as any).BarcodeDetector
        if (!BD) {
          setError('Seu navegador não suporta leitura automática. Use o botão “Digitar”.')
          return
        }

        // @ts-ignore
        const detector = new BD({ formats })

        const tick = async () => {
          try {
            if (!videoRef.current) return
            const barcodes = await detector.detect(videoRef.current)
            if (barcodes?.length) {
              const raw = barcodes[0].rawValue || ''
              if (raw) {
                onResult(raw)
                onClose()
                return
              }
            }
          } catch {}
          rafRef.current = requestAnimationFrame(tick)
        }

        rafRef.current = requestAnimationFrame(tick)
      } catch {
        setError('Não foi possível acessar a câmera. Verifique as permissões.')
      }
    }

    start()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [open, formats, onClose, onResult])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-3">
      <div className="w-full sm:max-w-md rounded-xl bg-card border border-stroke shadow-soft overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="font-semibold">{mode === 'product' ? 'Escanear Produto' : 'Escanear Endereço (QR)'}</div>
          <button className="text-white/70 hover:text-white" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        <div className="px-4 pb-4">
          <div className="rounded-xl overflow-hidden border border-stroke bg-black">
            <video ref={videoRef} className="w-full h-72 object-cover" playsInline muted />
          </div>
          {error && <div className="mt-3 text-sm text-amber-300">{error}</div>}
          <div className="mt-4 flex gap-3">
            <Button type="button" className="flex-1" onClick={onClose} variant="ghost">
              Voltar
            </Button>
          </div>
          <div className="mt-3 text-xs text-white/60">Dica: aproxime e mantenha o código dentro do quadro. Em alguns Android, funciona melhor no Chrome.</div>
        </div>
      </div>
    </div>
  )
}
