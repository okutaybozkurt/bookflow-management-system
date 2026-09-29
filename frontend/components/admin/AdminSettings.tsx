'use client'

import { useApp } from '@/lib/store'
import { API_URL } from '@/lib/api'

export default function AdminSettings() {
  const { userName, userEmail } = useApp()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Hesap ve bağlantı bilgileri</p>
      </div>

      {/* Hesap ve bağlantı bilgisi (salt okunur) */}
      <div className="bg-white rounded-xl border border-border divide-y divide-border">
        {[
          { label: 'Oturum açan yönetici', value: `${userName} (${userEmail})` },
          { label: 'API adresi', value: API_URL },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between px-5 py-4">
            <p className="text-sm font-medium text-foreground">{item.label}</p>
            <p className="text-sm text-muted-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
