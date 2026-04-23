'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/store'
import { Loader2, ShieldCheck } from 'lucide-react'

export default function AdminResetHandler() {
  const { addToast } = useApp()
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Command/Ctrl + Shift + P (Sunum Modu Reset)
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdKey = isMac ? e.metaKey : e.ctrlKey
      
      if (cmdKey && e.shiftKey && e.key.toUpperCase() === 'P') {
        e.preventDefault()
        
        if (confirm('Sistem pırıl pırıl Altın Veri ile sıfırlansın mı? (Sunum Modu)')) {
          try {
            setIsResetting(true)
            
            const res = await fetch('/api/admin/reset', {
              method: 'POST',
            })
            
            if (res.ok) {
              addToast('Sistem başarıyla sıfırlandı! Sunum hazır.', 'success')
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            } else {
              setIsResetting(false)
              addToast('Sıfırlama sırasında bir hata oluştu.', 'error')
            }
          } catch (error) {
            setIsResetting(false)
            addToast('Bağlantı hatası.', 'error')
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [addToast])

  if (!isResetting) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-white animate-in fade-in duration-300">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="relative bg-zinc-900 border border-primary/50 p-8 rounded-2xl flex flex-col items-center gap-6 shadow-2xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Sunum Modu Aktif Ediliyor</h2>
            <p className="text-zinc-400 text-sm">Veritabanı pırıl pırıl Altın Veri ile yenileniyor...</p>
          </div>
          <div className="flex items-center gap-3 text-primary font-medium">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Saniyeler içinde hazır...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
