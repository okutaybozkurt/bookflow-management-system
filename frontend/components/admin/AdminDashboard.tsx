'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { BookCopy, TrendingUp, Package, ArrowUpRight } from 'lucide-react'
import { useApp } from '@/lib/store'

export default function AdminDashboard() {
  const { metrics, monthlyRevenue, yearlyRevenue, books } = useApp()
  const [revenueFilter, setRevenueFilter] = useState<'monthly' | 'yearly'>('monthly')

  const revenueData = revenueFilter === 'monthly' ? monthlyRevenue : yearlyRevenue
  const revenueKey = revenueFilter === 'monthly' ? 'month' : 'year'

  const topBooks = [...books]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 6)
    .map((b) => ({ name: b.title.slice(0, 16) + (b.title.length > 16 ? '…' : ''), satis: b.sold }))

  const metricCards = [
    {
      label: 'Toplam Kitap',
      value: metrics.toplamKitap.toLocaleString('tr-TR'),
      icon: BookCopy,
      change: '+12%',
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Toplam Gelir',
      value: '₺' + metrics.toplamGelir.toLocaleString('tr-TR'),
      icon: TrendingUp,
      change: '+8.4%',
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Toplam Stok',
      value: metrics.toplamStok.toLocaleString('tr-TR'),
      icon: Package,
      change: '+3.1%',
      color: 'bg-blue-100 text-blue-600',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Hoş geldiniz, bugünkü özet bilgiler aşağıda.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{card.value}</p>
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-green-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {card.change}
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Gelir - Gider Takibi</h3>
              <p className="text-xs text-muted-foreground">Finansal performans özeti</p>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
              {(['monthly', 'yearly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setRevenueFilter(f)}
                  className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                    revenueFilter === f
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'monthly' ? 'Aylık' : 'Yıllık'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey={revenueKey} tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, '']}
                contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.9 0 0)', fontSize: '12px' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="gelir" name="Gelir" fill="oklch(0.68 0.19 46)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gider" name="Gider" fill="oklch(0.15 0 0)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Best Sellers Chart */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground text-sm">En Çok Satılan Kitaplar</h3>
            <p className="text-xs text-muted-foreground">Satış adedine göre sıralama</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topBooks} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} axisLine={false} tickLine={false} tickFormatter={(v) => v.toLocaleString('tr-TR')} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'oklch(0.5 0 0)' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                formatter={(value: number) => [value.toLocaleString('tr-TR') + ' adet', 'Satış']}
                contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.9 0 0)', fontSize: '12px' }}
              />
              <Bar dataKey="satis" name="Satış" fill="oklch(0.68 0.19 46)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
