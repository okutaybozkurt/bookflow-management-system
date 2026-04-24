'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/store'
import { Loader2, ShieldCheck, Trash2 } from 'lucide-react'

export default function AdminResetHandler() {
  const { addToast } = useApp()
  const [resetState, setResetState] = useState<{ active: boolean; mode: 'golden' | 'junk' | null }>({
    active: false,
    mode: null
  })

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Command (Mac) or Ctrl (Windows/Linux)
      const isCmd = e.metaKey || e.ctrlKey
      const isShift = e.shiftKey

      if (isCmd && isShift) {
        let mode: 'golden' | 'junk' | null = null

        if (e.code === 'KeyP') mode = 'golden' // Presentation (Altın)
        if (e.code === 'KeyD') mode = 'junk'   // Demo (Kirli)

        if (mode) {
          e.preventDefault()
          const confirmMsg = mode === 'golden'
            ? 'Sunum Moduna (Altın Veri) geçilsin mi?'
            : 'Demo Moduna (Kirli Veri) geri dönülsün mü?'

          if (confirm(confirmMsg)) {
            try {
              setResetState({ active: true, mode })

              const res = await fetch('/api/admin/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode }),
              })

              if (res.ok) {
                addToast(mode === 'golden' ? 'Sunum Hazır! (Altın Veri)' : 'Demo Modu Aktif (Kirli Veri)', 'success')
                setTimeout(() => window.location.reload(), 1500)
              } else {
                setResetState({ active: false, mode: null })
                addToast('Bir hata oluştu.', 'error')
              }
            } catch (error) {
              setResetState({ active: false, mode: null })
              addToast('Bağlantı hatası.', 'error')
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [addToast])

  if (!resetState.active) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-white animate-in fade-in duration-300">
      <div className="relative">
        <div className={`absolute inset-0 blur-3xl rounded-full animate-pulse ${resetState.mode === 'golden' ? 'bg-primary/20' : 'bg-red-500/20'}`}></div>
        <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-2xl flex flex-col items-center gap-6 shadow-2xl">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${resetState.mode === 'golden' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
            {resetState.mode === 'golden' ? <ShieldCheck className="w-8 h-8" /> : <Trash2 className="w-8 h-8" />}
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {resetState.mode === 'golden' ? 'Sunum Modu Aktif Ediliyor' : 'Demo Moduna Dönülüyor'}
            </h2>
            <p className="text-zinc-400 text-sm">
              {resetState.mode === 'golden' ? 'Veriler profesyonel Altın Veri ile yenileniyor...' : 'Veriler sunum öncesi kirli hale getiriliyor...'}
            </p>
          </div>
          <div className={`flex items-center gap-3 font-medium ${resetState.mode === 'golden' ? 'text-primary' : 'text-red-500'}`}>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Hazırlanıyor...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
