'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { logsApi } from '@/lib/services'
import { useAsync } from '@/lib/useAsync'
import ReportState from './ReportState'

const ACTIONS: Record<string, string> = {
  registered: 'Kayıt', login: 'Giriş', logout: 'Çıkış', created: 'Ekleme', updated: 'Güncelleme',
  deleted: 'Silme', restored: 'Geri getirme', order_created: 'Sipariş', status_changed: 'Durum değişimi',
}
const SUBJECTS = ['Book', 'Category', 'Author', 'Order', 'User']
const SUBJECT_LABEL: Record<string, string> = { Book: 'Kitap', Category: 'Kategori', Author: 'Yazar', Order: 'Sipariş', User: 'Kullanıcı' }

export default function AdminIslemKayitlari() {
  const [action, setAction] = useState('')
  const [subject, setSubject] = useState('')
  const [page, setPage] = useState(1)

  const logs = useAsync(
    () => logsApi.list({ action: action || undefined, subject_type: subject || undefined, page }),
    [action, subject, page],
  )

  const rows = logs.data?.data ?? []
  const lastPage = logs.data?.meta.last_page ?? 1

  const filterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value)
    setPage(1)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">İşlem Kayıtları</h1>
          <p className="text-sm text-muted-foreground">Kullanıcıların sistemde yaptığı işlemler</p>
        </div>
        <div className="flex gap-3">
          <select value={action} onChange={filterChange(setAction)} className="px-3 py-2 border border-border rounded-lg text-sm bg-white outline-none focus:border-primary">
            <option value="">Tüm işlemler</option>
            {Object.entries(ACTIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={subject} onChange={filterChange(setSubject)} className="px-3 py-2 border border-border rounded-lg text-sm bg-white outline-none focus:border-primary">
            <option value="">Tüm kayıt türleri</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{SUBJECT_LABEL[s]}</option>)}
          </select>
        </div>
      </div>

      <ReportState loading={logs.loading} error={logs.error} />

      {!logs.loading && !logs.error && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Tarih</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Kullanıcı</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">İşlem</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Açıklama</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">Kayıt bulunamadı.</td></tr>
              )}
              {rows.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{l.user?.name ?? <span className="text-muted-foreground">Sistem</span>}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{ACTIONS[l.action] ?? l.action}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{l.description}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{l.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lastPage > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-border rounded-lg disabled:opacity-40 hover:bg-muted"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-muted-foreground">Sayfa {page} / {lastPage}</span>
          <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage} className="p-2 border border-border rounded-lg disabled:opacity-40 hover:bg-muted"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  )
}
