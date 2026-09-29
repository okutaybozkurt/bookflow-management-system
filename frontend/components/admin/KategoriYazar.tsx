'use client'

import { useState } from 'react'
import { Check, Edit2, Loader2, Plus, Trash2, X } from 'lucide-react'
import { useApp } from '@/lib/store'
import { errorMessage } from '@/lib/api'
import { authorsApi, categoriesApi } from '@/lib/services'

interface Item { id: string; name: string; booksCount?: number }

interface ListCardProps {
  title: string
  noun: string
  items: Item[]
  onCreate: (name: string) => Promise<unknown>
  onRename: (id: string, name: string) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}

/** Ad ile yönetilen basit bir liste: ekle, yeniden adlandır, sil. */
function ListCard({ title, noun, items, onCreate, onRename, onDelete }: ListCardProps) {
  const { addToast, refreshCatalog } = useApp()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [busy, setBusy] = useState(false)

  // Her işlem: API çağrısı → listeyi yenile → bildirim. Hata mesajı API'den gelir.
  const run = async (action: () => Promise<unknown>, success: string) => {
    setBusy(true)
    try {
      await action()
      await refreshCatalog()
      addToast(success, 'success')
      return true
    } catch (error) {
      addToast(errorMessage(error), 'error')
      return false
    } finally {
      setBusy(false)
    }
  }

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    if (await run(() => onCreate(newName.trim()), `${noun} eklendi.`)) setNewName('')
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return
    if (await run(() => onRename(id, editName.trim()), `${noun} güncellendi.`)) setEditingId(null)
  }

  const remove = (item: Item) => {
    if (confirm(`"${item.name}" silinsin mi?`)) run(() => onDelete(item.id), `${noun} silindi.`)
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-sm">{title}</h2>
        <span className="text-xs text-muted-foreground">{items.length} kayıt</span>
      </div>

      <form onSubmit={add} className="px-5 py-3 border-b border-border flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`Yeni ${noun.toLowerCase()} adı`}
          className="flex-1 px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy || !newName.trim()}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-sm font-semibold px-3 py-2 rounded-lg"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Ekle
        </button>
      </form>

      <ul className="divide-y divide-border max-h-[480px] overflow-y-auto">
        {items.length === 0 && <li className="px-5 py-8 text-center text-sm text-muted-foreground">Kayıt yok.</li>}
        {items.map((item) => (
          <li key={item.id} className="px-5 py-2.5 flex items-center gap-3">
            {editingId === item.id ? (
              <>
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                  className="flex-1 px-2 py-1 border border-primary rounded-md text-sm outline-none"
                />
                <button onClick={() => saveEdit(item.id)} disabled={busy} aria-label="Kaydet" className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditingId(null)} aria-label="Vazgeç" className="p-1.5 text-muted-foreground hover:bg-muted rounded-md"><X className="w-4 h-4" /></button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.booksCount ?? 0} kitap</span>
                <button onClick={() => { setEditingId(item.id); setEditName(item.name) }} aria-label="Düzenle" className="p-1.5 text-primary hover:bg-primary/10 rounded-md"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(item)} disabled={busy} aria-label="Sil" className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function KategoriYazar() {
  const { categories, authors } = useApp()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Kategori ve Yazarlar</h1>
        <p className="text-sm text-muted-foreground">
          Kitabı olan kategori veya yazar silinemez; önce kitapları başka kategoriye/yazara taşıyın veya silin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListCard
          title="Kategoriler" noun="Kategori" items={categories}
          onCreate={categoriesApi.create} onRename={categoriesApi.update} onDelete={categoriesApi.remove}
        />
        <ListCard
          title="Yazarlar" noun="Yazar" items={authors}
          onCreate={authorsApi.create} onRename={authorsApi.update} onDelete={authorsApi.remove}
        />
      </div>
    </div>
  )
}
