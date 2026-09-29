'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useApp } from '@/lib/store'

export default function AdminRaporlar() {
  const { monthlyRevenue } = useApp()

  const netData = monthlyRevenue.map((d) => ({
    ...d,
    net: d.gelir - d.gider,
  }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Raporlar</h1>
        <p className="text-sm text-muted-foreground">Analitik ve performans raporları</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4">Aylık Net Kar Trendi</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={netData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`₺${v.toLocaleString('tr-TR')}`, '']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="gelir" name="Gelir" stroke="oklch(0.68 0.19 46)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="gider" name="Gider" stroke="oklch(0.15 0 0)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="net" name="Net Kar" stroke="oklch(0.55 0.15 150)" strokeWidth={2} strokeDasharray="4 2" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
