'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'
import { useApp } from '@/lib/store'

export default function AdminGelirGider() {
  const { monthlyRevenue } = useApp()
  const totalGelir = monthlyRevenue.reduce((s, d) => s + d.gelir, 0)
  const totalGider = monthlyRevenue.reduce((s, d) => s + d.gider, 0)
  const netKar = totalGelir - totalGider

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Gelir Gider Takibi</h1>
        <p className="text-sm text-muted-foreground">Yıllık finansal özet</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Toplam Gelir', value: totalGelir, color: 'text-green-600 bg-green-50' },
          { label: 'Toplam Gider', value: totalGider, color: 'text-red-600 bg-red-50' },
          { label: 'Net Kar', value: netKar, color: 'text-primary bg-primary/10' },
        ].map((c) => (
          <div key={c.label} className={`rounded-xl border border-border p-4 ${c.color}`}>
            <p className="text-xs font-medium opacity-70">{c.label}</p>
            <p className="text-lg font-bold mt-1">₺{c.value.toLocaleString('tr-TR')}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4">Aylık Karşılaştırma</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRevenue} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`₺${v.toLocaleString('tr-TR')}`, '']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="gelir" name="Gelir" fill="oklch(0.68 0.19 46)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gider" name="Gider" fill="oklch(0.15 0 0)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
