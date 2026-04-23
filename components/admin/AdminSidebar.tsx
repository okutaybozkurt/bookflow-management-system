'use client'

import {
  LayoutDashboard, BookCopy, ShoppingBag, BarChart2,
  TrendingUp, Settings, LogOut, BookOpen, Users
} from 'lucide-react'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'kitap-yonetimi', label: 'Kitap Yönetimi', icon: BookCopy },
  { id: 'kullanici-yonetimi', label: 'Kullanıcı/Personel', icon: Users },
  { id: 'siparisler', label: 'Siparişler', icon: ShoppingBag },
  { id: 'raporlar', label: 'Raporlar', icon: BarChart2 },
  { id: 'gelir-gider', label: 'Gelir Gider Takibi', icon: TrendingUp },
  { id: 'ayarlar', label: 'Ayarlar', icon: Settings },
]

export default function AdminSidebar() {
  const { adminPage, setAdminPage, logout } = useApp()

  return (
    <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold text-white">
            Book<span className="text-primary">Flow</span>
          </span>
          <p className="text-[10px] text-sidebar-foreground/50 leading-none mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = adminPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setAdminPage(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
