'use client'

import { BookOpen } from 'lucide-react'
import { useApp } from '@/lib/store'

/** Yalnızca çalışan bağlantılar: her biri uygulamanın gerçek bir sayfasına gider. */
export default function Footer() {
  const { setCustomerView, userRole } = useApp()

  const go = (view: 'home' | 'cart' | 'favorites' | 'profile') => {
    setCustomerView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const links = [
    { label: 'Ana Sayfa', view: 'home' as const },
    { label: 'Sepetim', view: 'cart' as const },
    ...(userRole === 'customer'
      ? [
          { label: 'Favorilerim', view: 'favorites' as const },
          { label: 'Hesabım ve Siparişlerim', view: 'profile' as const },
        ]
      : []),
  ]

  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">
              Kitap<span className="text-primary">Üssü</span>
            </span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Kitapları keşfedin, favorilerinize ekleyin ve siparişinizi tek adımda tamamlayın.
            Sorularınız için sağ alttaki destek asistanını kullanabilirsiniz.
          </p>
        </div>

        <nav aria-label="Hızlı bağlantılar">
          <h3 className="font-bold text-sm mb-3 uppercase tracking-widest">Hızlı Bağlantılar</h3>
          <ul className="space-y-2 text-xs text-white/70">
            {links.map((l) => (
              <li key={l.view}>
                <button onClick={() => go(l.view)} className="hover:text-primary transition-colors">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <p className="max-w-7xl mx-auto px-4 py-5 text-xs text-white/60">
          &copy; {new Date().getFullYear()} KitapÜssü. Tüm Hakları Saklıdır.
        </p>
      </div>
    </footer>
  )
}
