'use client'

import { Globe } from 'lucide-react'
import { useApp } from '@/lib/store'

export default function AdminHeader() {
  const { setIsAdminView, userName } = useApp()

  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-6 gap-4 shrink-0">
      <div className="ml-auto flex items-center gap-4">
        {/* Siteye Dön Butonu (Önemli: Admin ile Müşteri arasında köprü) */}
        <button 
          onClick={() => setIsAdminView(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-bold"
        >
          <Globe className="w-3.5 h-3.5" />
          Siteye Dön
        </button>

        {/* Admin Profil Özeti (Sadece İsim) */}
        <div className="flex items-center gap-2 pl-4 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[10px] font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-foreground leading-none">{userName}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tighter">Yönetici</p>
          </div>
        </div>
      </div>
    </header>
  )
}
