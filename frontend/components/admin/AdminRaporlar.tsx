'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { reportsApi } from '@/lib/services'
import { useAsync } from '@/lib/useAsync'
import ReportState, { money } from './ReportState'

export default function AdminRaporlar() {
  const categories = useAsync(() => reportsApi.categories(), [])
  const top = useAsync(() => reportsApi.topBooks(10), [])
  const lowStock = useAsync(() => reportsApi.lowStock(), [])

  const categoryChart = (categories.data ?? []).map((c) => ({ name: c.name, gelir: c.revenue }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Satış Raporları</h1>
        <p className="text-sm text-muted-foreground">Kategori, kitap ve stok bazlı satış analizi</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground text-sm mb-4">Kategoriye Göre Gelir</h3>
        <ReportState loading={categories.loading} error={categories.error} />
        {!categories.loading && !categories.error && (
          categoryChart.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Henüz satış yok.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [money(v), 'Gelir']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="gelir" fill="oklch(0.68 0.19 46)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <h3 className="font-semibold text-foreground text-sm p-5 pb-3">En Çok Satan 10 Kitap</h3>
          <ReportState loading={top.loading} error={top.error} />
          <table className="w-full text-sm">
            <tbody>
              {(top.data ?? []).map((b, i) => (
                <tr key={b.book_id} className="border-t border-border">
                  <td className="px-5 py-2.5 text-muted-foreground w-8">{i + 1}</td>
                  <td className="py-2.5 font-medium text-foreground">{b.title}</td>
                  <td className="py-2.5 text-right text-muted-foreground">{b.quantity_sold} adet</td>
                  <td className="px-5 py-2.5 text-right font-semibold">{money(b.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <h3 className="font-semibold text-foreground text-sm p-5 pb-3">Düşük Stok (5 ve altı)</h3>
          <ReportState loading={lowStock.loading} error={lowStock.error} />
          {!lowStock.loading && (lowStock.data?.length ?? 0) === 0 && !lowStock.error && (
            <p className="px-5 pb-6 text-sm text-muted-foreground">Düşük stoklu kitap yok. 👍</p>
          )}
          <table className="w-full text-sm">
            <tbody>
              {(lowStock.data ?? []).map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-5 py-2.5 font-medium text-foreground">{b.title}</td>
                  <td className={`px-5 py-2.5 text-right font-semibold ${b.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    {b.stock === 0 ? 'Tükendi' : `${b.stock} adet`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
