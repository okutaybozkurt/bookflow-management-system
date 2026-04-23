'use client'

import { useState } from 'react'
import { HelpCircle, Sparkles, FlaskConical, AlertTriangle } from 'lucide-react'
import { useApp } from '@/lib/store'

export default function AdminSettings() {
  const { dataMode, setDataMode } = useApp()
  const [activeMode, setActiveMode] = useState<string | null>(null)

  const applyMode = (mode: 'golden' | 'junk') => {
    setActiveMode(mode)
    setDataMode(mode)
    setTimeout(() => setActiveMode(null), 2000)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Sistem tercihleri ve yapılandırmalar</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-border divide-y divide-border">
        {[
          { label: 'Bildirimler', desc: 'E-posta ve sistem bildirimlerini yönetin' },
          { label: 'Güvenlik', desc: 'Şifre ve iki faktörlü kimlik doğrulama' },
          { label: 'Entegrasyonlar', desc: 'Üçüncü parti uygulama bağlantıları' },
          { label: 'Dil ve Bölge', desc: 'Türkçe / UTC+3 İstanbul' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
            <button className="text-xs text-primary font-medium hover:underline">Düzenle</button>
          </div>
        ))}
      </div>

      {/* Developer Tools — subtle card */}
      <div className="relative border border-dashed border-border rounded-xl p-5 bg-muted/30">
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Geliştirici Araçları
          </span>
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">Demo Mode Data Management</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Bu bölüm yalnızca sunum ve geliştirme amacıyla mevcuttur. Veri durumunu anında değiştirir.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Golden Seed */}
          <div className="bg-white border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Golden Data Seed</p>
                <p className="text-xs text-muted-foreground">Sunum Modu Verisi</p>
              </div>
              <button
                className="ml-auto text-muted-foreground hover:text-primary"
                title="Gerçekçi ve profesyonel verilerle doldurur. Sunum anında kullanın."
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Tüm bileşenleri gerçekçi ve profesyonel verilerle doldurur. Müşteri sunumları için idealdir.
            </p>
            <button
              onClick={() => applyMode('golden')}
              className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                dataMode === 'golden'
                  ? activeMode === 'golden'
                    ? 'bg-green-500 text-white'
                    : 'bg-primary/10 text-primary border border-primary/30 cursor-default'
                  : 'bg-primary hover:bg-primary/90 text-white'
              }`}
            >
              {activeMode === 'golden'
                ? '✓ Uygulandı!'
                : dataMode === 'golden'
                ? '✓ Aktif - Golden Data'
                : 'Golden Data Seed Uygula'}
            </button>
          </div>

          {/* Junk Seed */}
          <div className="bg-white border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Junk Data Seed</p>
                <p className="text-xs text-muted-foreground">Local / Test Verisi</p>
              </div>
              <button
                className="ml-auto text-muted-foreground hover:text-amber-500"
                title="Bileşenleri dağınık test verileriyle doldurur. Geliştirici testleri için."
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Tüm bileşenleri dağınık, anlamsız test verileriyle doldurur. Yalnızca geliştirici testleri için.
            </p>
            <button
              onClick={() => applyMode('junk')}
              className={`w-full py-2 rounded-lg text-xs font-semibold transition-all border ${
                dataMode === 'junk'
                  ? activeMode === 'junk'
                    ? 'bg-green-500 text-white border-transparent'
                    : 'bg-amber-50 text-amber-700 border-amber-300 cursor-default'
                  : 'bg-foreground hover:bg-foreground/80 text-white border-transparent'
              }`}
            >
              {activeMode === 'junk'
                ? '✓ Uygulandı!'
                : dataMode === 'junk'
                ? '⚠ Aktif - Junk Data'
                : 'Junk Data Seed Uygula'}
            </button>
          </div>
        </div>

        {dataMode === 'junk' && (
          <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-medium">Junk Data modu aktif — uygulama test verileriyle çalışıyor.</span>
          </div>
        )}
      </div>
    </div>
  )
}
