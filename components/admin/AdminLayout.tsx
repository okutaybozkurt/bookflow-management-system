'use client'

import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminDashboard from './AdminDashboard'
import KitapYonetimi from './KitapYonetimi'
import KullaniciYonetimi from './KullaniciYonetimi'
import AdminOrders from './AdminOrders'
import AdminRaporlar from './AdminRaporlar'
import AdminGelirGider from './AdminGelirGider'
import AdminSettings from './AdminSettings'
import SupportChat from '@/components/SupportChat'
import { useApp } from '@/lib/store'

export default function AdminLayout() {
  const { adminPage } = useApp()

  const renderPage = () => {
    switch (adminPage) {
      case 'dashboard': return <AdminDashboard />
      case 'kitap-yonetimi': return <KitapYonetimi />
      case 'kullanici-yonetimi': return <KullaniciYonetimi />
      case 'siparisler': return <AdminOrders />
      case 'raporlar': return <AdminRaporlar />
      case 'gelir-gider': return <AdminGelirGider />
      case 'ayarlar': return <AdminSettings />
      default: return <AdminDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <SupportChat />
    </div>
  )
}
