'use client'

import { useApp } from '@/lib/store'
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const { orders, userName, userEmail, logout, setCustomerView } = useApp()

  const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    pending: { label: 'Beklemede', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    shipped: { label: 'Kargoda', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    delivered: { label: 'Teslim Edildi', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    cancelled: { label: 'İptal Edildi', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{userName}</h1>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-xs font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-lg font-bold text-foreground">Siparişlerim</h2>
            <span className="text-sm text-muted-foreground font-normal">({orders.length})</span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-12 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div>
                <p className="font-bold text-foreground">Henüz bir siparişiniz yok.</p>
                <p className="text-sm text-muted-foreground">Keyifli alışverişler dileriz!</p>
              </div>
              <button
                onClick={() => setCustomerView('home')}
                className="mt-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
              >
                Kitaplara Gözat
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending
                const StatusIcon = status.icon

                return (
                  <div key={order.id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="px-6 py-4 bg-muted/30 border-b border-border flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sipariş No</p>
                          <p className="text-sm font-bold text-foreground">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tarih</p>
                          <p className="text-sm font-semibold text-foreground">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Toplam</p>
                          <p className="text-sm font-bold text-primary">{order.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{status.label}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-3 group">
                            <div className="w-12 h-16 relative rounded-md overflow-hidden bg-muted border border-border shrink-0">
                              <Image src={item.cover} alt={item.title} fill className="object-cover" />
                            </div>
                            <div className="max-w-[150px]">
                              <p className="text-xs font-bold text-foreground line-clamp-1">{item.title}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{item.author}</p>
                              <p className="text-[10px] font-bold text-foreground mt-1">{item.quantity} Adet</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Account Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-lg font-bold text-foreground">Hesap Bilgileri</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Ad Soyad</label>
                <div className="px-4 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground font-medium">
                  {userName}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">E-posta Adresi</label>
                <div className="px-4 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground font-medium">
                  {userEmail}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Hesap Türü</label>
                <div className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary font-bold">
                  Kullanıcı Hesabı
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted text-xs font-semibold text-foreground transition-colors">
                Bilgilerimi Güncelle
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted text-xs font-semibold text-foreground transition-colors">
                Şifre Değiştir
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 text-xs font-semibold text-red-500 transition-colors">
                Hesabımı Sil
              </button>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <h3 className="font-bold text-primary text-sm mb-2">Sadakat Programı</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Her alışverişinizde puan kazanın ve bir sonraki kitabınızı indirimli alın!
            </p>
            <div className="mt-4 h-2 bg-primary/10 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-primary" />
            </div>
            <p className="text-[10px] text-primary font-bold mt-2 text-right">650 / 1000 Puan</p>
          </div>
        </div>
      </div>
    </div>
  )
}
