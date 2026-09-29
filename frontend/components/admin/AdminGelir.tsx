'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { reportsApi } from '@/lib/services'
import { useAsync } from '@/lib/useAsync'
import ReportState, { money, periodLabel } from './ReportState'

export default function AdminGelir() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const sales = useAsync(() => reportsApi.sales(period, period === 'monthly' ? 12 : 5), [period])

  const points = sales.data ?? []
  const totalRevenue = points.reduce((s, p) => s + p.revenue, 0)
  const totalOrders = points.reduce((s, p) => s + p.orders, 0)
  const average = totalOrders ? totalRevenue / totalOrders : 0
  const chart = points.map((p) => ({ name: periodLabel(p.period), gelir: p.revenue, siparis: p.orders }))

  const cards = [
    { label: 'Toplam Gelir', value: money(totalRevenue), color: 'text-green-600 bg-green-50' },
    { label: 'Sipariş Sayısı', value: totalOrders.toLocaleString('tr-TR'), color: 'text-primary bg-primary/10' },
    { label: 'Ortalama Sipariş Tutarı', value: money(average), color: 'text-blue-600 bg-blue-50' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Gelir Raporu</h1>
          <p className="text-sm text-muted-foreground">
            {period === 'monthly' ? 'Son 12 ay' : 'Son 5 yıl'} · iptal edilen siparişler hariç
          </p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {(['monthly', 'yearly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setPeriod(f)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map((c) => (
              <div key={c.label} className={`rounded-xl border border-border p-4 ${c.color}`}>
                <p className="text-xs font-medium opacity-70">{c.label}</p>
                <p className="text-lg font-bold mt-1">{c.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">{period === 'monthly' ? 'Aylık' : 'Yıllık'} Gelir</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [money(v), 'Gelir']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="gelir" name="Gelir" fill="oklch(0.68 0.19 46)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
