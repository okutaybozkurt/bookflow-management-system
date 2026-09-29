'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { BookCopy, TrendingUp, Package, ShoppingCart, AlertTriangle } from 'lucide-react'
import { reportsApi } from '@/lib/services'
import { useAsync } from '@/lib/useAsync'
import ReportState, { money, periodLabel } from './ReportState'

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const summary = useAsync(() => reportsApi.summary(), [])
  const sales = useAsync(() => reportsApi.sales(period), [period])
  const top = useAsync(() => reportsApi.topBooks(6), [])
  const lowStock = useAsync(() => reportsApi.lowStock(), [])

  const s = summary.data
  const metricCards = s ? [
    { label: 'Toplam Kitap', value: s.total_books.toLocaleString('tr-TR'), icon: BookCopy, color: 'bg-primary/10 text-primary' },
    { label: 'Toplam Gelir', value: money(s.total_revenue), icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Sipariş', value: `${s.total_orders.toLocaleString('tr-TR')} (${s.pending_orders} bekleyen)`, icon: ShoppingCart, color: 'bg-purple-100 text-purple-600' },
    { label: 'Toplam Stok', value: s.total_stock.toLocaleString('tr-TR'), icon: Package, color: 'bg-blue-100 text-blue-600' },
  ] : []

  const revenueData = (sales.data ?? []).map((p) => ({ name: periodLabel(p.period), gelir: p.revenue }))
  const topBooks = (top.data ?? []).map((b) => ({
    name: b.title.slice(0, 16) + (b.title.length > 16 ? '…' : ''), satis: b.quantity_sold,
  }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Gerçek sipariş verilerine dayalı özet bilgiler.</p>
      </div>

      <ReportState loading={summary.loading} error={summary.error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                <p className="text-lg font-bold text-foreground mt-0.5 truncate">{card.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Gelir</h3>
              <p className="text-xs text-muted-foreground">İptal edilen siparişler hariç</p>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
              {(['monthly', 'yearly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setPeriod(f)}
                  className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                    period === f ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'monthly' ? 'Aylık' : 'Yıllık'}
                </button>
              ))}
            </div>
          </div>
          <ReportState loading={sales.loading} error={sales.error} />
          {!sales.loading && !sales.error && (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [money(value), 'Gelir']} contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.9 0 0)', fontSize: '12px' }} />
                <Bar dataKey="gelir" name="Gelir" fill="oklch(0.68 0.19 46)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground text-sm">En Çok Satılan Kitaplar</h3>
            <p className="text-xs text-muted-foreground">Satış adedine göre sıralama</p>
          </div>
          <ReportState loading={top.loading} error={top.error} />
          {!top.loading && !top.error && (
            topBooks.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">Henüz satış yok.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topBooks} layout="vertical" barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip formatter={(value: number) => [value.toLocaleString('tr-TR') + ' adet', 'Satış']} contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.9 0 0)', fontSize: '12px' }} />
                  <Bar dataKey="satis" name="Satış" fill="oklch(0.68 0.19 46)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          )}
        </div>
      </div>

      {(lowStock.data?.length ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3 text-amber-800 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" /> Düşük stok uyarısı
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.data!.map((b) => (
              <span key={b.id} className="text-xs bg-white border border-amber-200 text-amber-900 rounded-full px-3 py-1">
                {b.title} · <strong>{b.stock}</strong> adet
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
