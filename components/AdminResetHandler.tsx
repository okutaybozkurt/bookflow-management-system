'use client'

import { useEffect } from 'react'
import { useApp } from '@/lib/store'

export default function AdminResetHandler() {
  const { addToast, userRole } = useApp()

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ctrl + Shift + R (Sunum Modu Reset)
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'R') {
        e.preventDefault()
        
        if (confirm('Sistem pırıl pırıl Altın Veri ile sıfırlansın mı? (Sunum Modu)')) {
          try {
            addToast('Sistem sıfırlanıyor...', 'info')
            
            const res = await fetch('/api/admin/reset', {
              method: 'POST',
            })
            
            if (res.ok) {
              addToast('Sistem başarıyla sıfırlandı! Sayfa yenileniyor...', 'success')
              setTimeout(() => {
                window.location.reload()
              }, 2000)
            } else {
              addToast('Sıfırlama sırasında bir hata oluştu.', 'error')
            }
          } catch (error) {
            addToast('Bağlantı hatası.', 'error')
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [addToast])

  return null
}
