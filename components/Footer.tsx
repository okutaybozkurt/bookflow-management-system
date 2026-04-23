'use client'

import { Instagram, Music } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Kurumsal */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-widest">Kurumsal</h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  İletişim
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kariyer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Basın Merkezi
                </a>
              </li>
            </ul>
          </div>

          {/* Popüler Kategoriler */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-widest">Popüler Kategoriler</h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Roman
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Bilim & Teknoloji
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  KPSS & Sınavlar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Çocuk Kitapları
                </a>
              </li>
            </ul>
          </div>

          {/* Yardım & Destek */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-widest">Yardım & Destek</h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  SSS
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Gönderim & İade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kargo Takibi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Canlı Destek
                </a>
              </li>
            </ul>
          </div>

          {/* KitapÜssü */}
          <div>
            <h3 className="font-bold text-sm mb-4 uppercase tracking-widest">KitapÜssü</h3>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Türkiye&apos;nin en geniş çevrimiçi kitap mağazasında milyonlarca kitaptan seçin, hızlı kargo ile evinize teslim alın.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 py-8">
          {/* Bizi Takip Edin */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <h3 className="font-bold text-sm uppercase tracking-widest">Bizi Takip Edin</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                title="TikTok"
              >
                <Music className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Ödeme Yöntemleri */}
          <div className="mb-8">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-4 text-center">Ödeme Yöntemleri</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">

              {/* Visa */}
              <div className="bg-white rounded px-3 py-1.5 flex items-center justify-center h-9 w-16">
                <svg viewBox="0 0 780 500" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <path d="M293.2 348.7l33.36-195.3h53.36l-33.4 195.3H293.2zm246.2-190.5c-10.57-3.96-27.14-8.2-47.82-8.2-52.73 0-89.85 26.6-90.16 64.72-.27 28.18 26.56 43.9 46.84 53.28 20.77 9.6 27.75 15.74 27.65 24.3-.13 13.12-16.6 19.1-31.95 19.1-21.38 0-32.74-2.98-50.27-10.3l-6.88-3.1-7.49 43.78c12.47 5.47 35.54 10.22 59.5 10.46 56.13 0 92.56-26.3 92.94-67.07.19-22.35-14.06-39.33-44.9-53.33-18.7-9.08-30.14-15.14-30.02-24.34 0-8.16 9.69-16.88 30.64-16.88 17.48-.27 30.14 3.54 40.02 7.5l4.8 2.26 7.26-42.2zm137.5-4.83h-41.22c-12.77 0-22.32 3.5-27.93 16.26l-79.2 179.1h56.01l11.17-29.3h68.43c1.6 6.83 6.5 29.3 6.5 29.3h49.5l-43.26-195.3zm-65.5 126.8l21.18-54.3c-.27.47 4.36-11.27 7.05-18.56l3.59 16.77s10.17 46.55 12.29 56.1h-44.1zm-472.9-126.8l-52.32 133.3-5.58-27.13c-9.73-31.27-40.12-65.2-74.1-82.1l47.82 171.2h56.42l83.9-195.3h-56.14z" fill="#1A1F71"/>
                  <path d="M150.8 153.2H63.27l-.68 3.9c68.28 16.56 113.5 56.56 132.3 104.6l-19.1-91.6c-3.29-12.63-12.83-16.49-24.97-16.9z" fill="#F9A533"/>
                </svg>
              </div>

              {/* Mastercard */}
              <div className="bg-white rounded px-3 py-1.5 flex items-center justify-center h-9 w-16">
                <svg viewBox="0 0 131.39 86.9" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect x="48.37" width="34.66" height="86.9" fill="#ff5f00"/>
                  <path d="M51.94 43.45a55.17 55.17 0 0 1 21.1-43.45A55.25 55.25 0 1 0 51.94 43.45z" fill="#eb001b"/>
                  <path d="M162.39 43.45A55.25 55.25 0 0 1 72.95 86.9a55.26 55.26 0 0 0 0-86.9 55.25 55.25 0 0 1 89.44 43.45z" transform="translate(-31)" fill="#f79e1b"/>
                </svg>
              </div>

              {/* Troy */}
              <div className="bg-white rounded px-3 py-1.5 flex items-center justify-center h-9 w-16">
                <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="200" height="80" rx="4" fill="#1D3C78"/>
                  <text x="100" y="52" textAnchor="middle" fill="white" fontSize="30" fontWeight="bold" fontFamily="Arial">troy</text>
                  <rect x="10" y="60" width="80" height="5" fill="#E63329"/>
                  <rect x="110" y="60" width="80" height="5" fill="#E63329"/>
                </svg>
              </div>

              {/* BKM Express */}
              <div className="bg-white rounded px-3 py-1.5 flex items-center justify-center h-9 w-20">
                <svg viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="220" height="80" rx="4" fill="#fff"/>
                  <circle cx="30" cy="40" r="22" fill="#E63329"/>
                  <text x="30" y="46" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">BKM</text>
                  <text x="130" y="32" textAnchor="middle" fill="#1D3C78" fontSize="20" fontWeight="bold" fontFamily="Arial">Express</text>
                  <rect x="60" y="44" width="140" height="3" fill="#E63329"/>
                </svg>
              </div>

              {/* Bonus */}
              <div className="bg-white rounded px-3 py-1.5 flex items-center justify-center h-9 w-16">
                <svg viewBox="0 0 160 60" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="160" height="60" rx="4" fill="#fff"/>
                  <text x="80" y="40" textAnchor="middle" fill="#E63329" fontSize="28" fontWeight="900" fontFamily="Arial">bonus</text>
                </svg>
              </div>

              {/* Maximum */}
              <div className="bg-white rounded px-3 py-1.5 flex items-center justify-center h-9 w-20">
                <svg viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="180" height="60" rx="4" fill="#fff"/>
                  <text x="90" y="40" textAnchor="middle" fill="#1D3C78" fontSize="24" fontWeight="900" fontFamily="Arial">maximum</text>
                </svg>
              </div>

              {/* World */}
              <div className="bg-white rounded px-3 py-1.5 flex items-center justify-center h-9 w-16">
                <svg viewBox="0 0 140 60" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="140" height="60" rx="4" fill="#fff"/>
                  <circle cx="30" cy="30" r="20" fill="#1D9B5E"/>
                  <text x="30" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">WRD</text>
                  <text x="95" y="37" textAnchor="middle" fill="#1D9B5E" fontSize="22" fontWeight="bold" fontFamily="Arial">World</text>
                </svg>
              </div>

              {/* Axess */}
              <div className="bg-white rounded px-3 py-1.5 flex items-center justify-center h-9 w-16">
                <svg viewBox="0 0 140 60" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="140" height="60" rx="4" fill="#fff"/>
                  <text x="70" y="40" textAnchor="middle" fill="#E63329" fontSize="26" fontWeight="900" fontFamily="Arial">axess</text>
                </svg>
              </div>

              {/* Paraf */}
              <div className="bg-white rounded px-3 py-1.5 flex items-center justify-center h-9 w-16">
                <svg viewBox="0 0 140 60" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="140" height="60" rx="4" fill="#fff"/>
                  <text x="70" y="40" textAnchor="middle" fill="#7B2D8B" fontSize="26" fontWeight="900" fontFamily="Arial">paraf</text>
                </svg>
              </div>

              {/* Bankkart */}
              <div className="bg-white rounded px-3 py-1.5 flex items-center justify-center h-9 w-20">
                <svg viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="180" height="60" rx="4" fill="#fff"/>
                  <rect x="0" y="0" width="180" height="30" rx="4" fill="#E63329"/>
                  <text x="90" y="22" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">BANK</text>
                  <text x="90" y="50" textAnchor="middle" fill="#E63329" fontSize="16" fontWeight="bold" fontFamily="Arial">KART</text>
                </svg>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>&copy; 2024 KitapÜssü. Tüm Hakları Saklıdır.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Gizlilik Politikası
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Kullanım Koşulları
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Çerez Politikası
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
