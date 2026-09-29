'use client'

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Package, Truck, CheckCircle, XCircle, Search, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '@/lib/store'
import { errorMessage } from '@/lib/api'
import { ordersApi } from '@/lib/services'
import type { Order, OrderStatus } from '@/lib/store/types'

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string }> = {
  pending: { label: 'Beklemede', icon: Package, color: 'text-amber-600 bg-amber-50' },
  shipped: { label: 'Kargoda', icon: Truck, color: 'text-blue-600 bg-blue-50' },
  delivered: { label: 'Teslim Edildi', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'İptal', icon: XCircle, color: 'text-red-600 bg-red-50' },
}

/** Backend'deki durum akışının aynısı: hangi durumdan hangisine geçilebilir. */
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

export default function AdminOrders() {
  const { addToast, refreshCatalog } = useApp()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    try {
      setOrders(await ordersApi.listAdmin())
    } catch (error) {
      addToast(errorMessage(error, 'Siparişler yüklenemedi.'), 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { load() }, [load])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return orders.filter((o) =>
      (filter === 'all' || o.status === filter) &&
      (!term || o.id.toLowerCase().includes(term) || o.customerName.toLowerCase().includes(term) || o.customerEmail.toLowerCase().includes(term))
    )
  }, [orders, filter, search])

  const changeStatus = async (order: Order, status: OrderStatus) => {
    if (status === 'cancelled' && !confirm(`${order.id} numaralı sipariş iptal edilsin mi? Stok iade edilecek.`)) return
    setBusyId(order.dbId)
    try {
      const updated = await ordersApi.updateStatus(order.dbId, status)
      setOrders((prev) => prev.map((o) => (o.dbId === updated.dbId ? updated : o)))
      addToast(`Sipariş durumu: ${statusConfig[status].label}`, 'success')
      if (status === 'cancelled') refreshCatalog() // iptalde stok iade edilir
    } catch (error) {
      addToast(errorMessage(error, 'Durum güncellenemedi.'), 'error')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Siparişler</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Yükleniyor...' : `${visible.length} sipariş listeleniyor`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sipariş no veya müşteri ara..."
              className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary w-64"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-white outline-none focus:border-primary"
          >
            <option value="all">Tüm durumlar</option>
            {(Object.keys(statusConfig) as OrderStatus[]).map((s) => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>
        </div>
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
              <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {!loading && visible.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">Sipariş bulunamadı.</td></tr>
            )}
            {visible.map((order) => {
              const sc = statusConfig[order.status]
              const Icon = sc.icon
              const isOpen = expanded === order.dbId
              const next = NEXT_STATUSES[order.status]
              return (
                <Fragment key={order.dbId}>
                  <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-primary">
                      <button onClick={() => setExpanded(isOpen ? null : order.dbId)} className="flex items-center gap-1">
                        {order.id}
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground hidden sm:table-cell">
                      {order.customerName}
                      <span className="block text-xs text-muted-foreground">{order.customerEmail}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{order.date}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground text-right">₺{order.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>
                        <Icon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {busyId === order.dbId ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto text-muted-foreground" />
                      ) : next.length === 0 ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          {next.map((s) => (
                            <button
                              key={s}
                              onClick={() => changeStatus(order, s)}
                              className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-colors ${
                                s === 'cancelled'
                                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                                  : 'border-primary/30 text-primary hover:bg-primary/10'
                              }`}
                            >
                              {s === 'shipped' ? 'Kargola' : s === 'delivered' ? 'Teslim Et' : 'İptal Et'}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${order.dbId}-detail`} className="bg-muted/20 border-b border-border">
                      <td colSpan={6} className="px-6 py-4 text-sm space-y-2">
                        <p className="text-xs text-muted-foreground">Teslimat adresi: <span className="text-foreground">{order.shippingAddress}</span></p>
                        <ul className="space-y-1">
                          {order.items.map((i) => (
                            <li key={i.id} className="flex justify-between">
                              <span>{i.quantity} × {i.title} <span className="text-muted-foreground">({i.author})</span></span>
                              <span className="font-medium">₺{(i.price * i.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-muted-foreground text-right">
                          Ara toplam ₺{order.subtotal.toFixed(2)} · Kargo ₺{order.shippingFee.toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
