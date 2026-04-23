'use client'

import { Package, Truck, CheckCircle, XCircle } from 'lucide-react'

const orders = [
  { id: '#BF-10421', customer: 'Ahmet Yıldız', date: '23 Nis 2026', amount: 449.80, status: 'delivered', items: 3 },
  { id: '#BF-10420', customer: 'Fatma Kaya', date: '22 Nis 2026', amount: 189.90, status: 'shipped', items: 1 },
  { id: '#BF-10419', customer: 'Mehmet Demir', date: '22 Nis 2026', amount: 714.40, status: 'pending', items: 4 },
  { id: '#BF-10418', customer: 'Ayşe Çelik', date: '21 Nis 2026', amount: 215.00, status: 'delivered', items: 1 },
  { id: '#BF-10417', customer: 'Mustafa Şahin', date: '21 Nis 2026', amount: 129.90, status: 'cancelled', items: 1 },
  { id: '#BF-10416', customer: 'Zeynep Arslan', date: '20 Nis 2026', amount: 596.90, status: 'delivered', items: 3 },
  { id: '#BF-10415', customer: 'İbrahim Koç', date: '20 Nis 2026', amount: 249.50, status: 'shipped', items: 2 },
]

const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
  pending: { label: 'Beklemede', icon: Package, color: 'text-amber-600 bg-amber-50' },
  shipped: { label: 'Kargoda', icon: Truck, color: 'text-blue-600 bg-blue-50' },
  delivered: { label: 'Teslim Edildi', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'İptal', icon: XCircle, color: 'text-red-600 bg-red-50' },
}

export default function AdminOrders() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Siparişler</h1>
        <p className="text-sm text-muted-foreground">{orders.length} aktif sipariş</p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Sipariş No</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Müşteri</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Tarih</th>
              <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Tutar</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const sc = statusConfig[order.status]
              const Icon = sc.icon
              return (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-primary">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-foreground hidden sm:table-cell">{order.customer}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{order.date}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground text-right">₺{order.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>
                      <Icon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
