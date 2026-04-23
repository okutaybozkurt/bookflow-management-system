'use client'

import { useState, useRef, useMemo } from 'react'
import { Plus, Search, Edit2, Trash2, X, Loader2, Upload, Image as ImageIcon } from 'lucide-center'
import { Plus as PlusIcon, Search as SearchIcon, Edit2 as EditIcon, Trash2 as TrashIcon, X as XIcon, Loader2 as LoaderIcon, Upload as UploadIcon, ImageIcon as ImgIcon } from 'lucide-react'
import Image from 'next/image'
import { useApp } from '@/lib/store'

type Tab = 'list' | 'add' | 'edit'

export default function KitapYonetimi() {
  const { books, categories, addToast } = useApp()
  const [tab, setTab] = useState<Tab>('list')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingBook, setEditingBook] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    isbn: '',
    category: '',
    cover: '',
    description: '',
  })

  const filteredBooks = useMemo(() => {
    return books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [books, searchTerm])

  const handleEdit = (book: any) => {
    setEditingBook(book)
    setForm({
      title: book.title,
      author: book.author,
      price: book.price.toString(),
      stock: book.stock.toString(),
      isbn: book.isbn || '',
      category: book.category,
      cover: book.cover,
      description: book.description || '',
    })
    setTab('edit')
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Bu kitabı silmek istediğinize emin misiniz?')) return
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
      if (res.ok) {
        addToast('Kitap silindi.', 'success')
        setTimeout(() => window.location.reload(), 1000)
      }
    } catch (error) {
      addToast('Silme işlemi başarısız.', 'error')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 400
        const scale = MAX_WIDTH / img.width
        canvas.width = MAX_WIDTH
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        const base64 = canvas.toDataURL('image/jpeg', 0.6)
        setForm({ ...form, cover: base64 })
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const url = tab === 'edit' ? `/api/books/${editingBook.id}` : '/api/books'
      const method = tab === 'edit' ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      if (res.ok) {
        addToast(tab === 'edit' ? 'Güncelleme başarılı!' : 'Kitap eklendi!', 'success')
        setTimeout(() => window.location.reload(), 1000)
      } else {
        const err = await res.json()
        addToast(err.error || 'İşlem başarısız.', 'error')
      }
    } catch (error) {
      addToast('Bağlantı hatası.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Kitap Yönetimi</h1>
          <p className="text-sm text-muted-foreground">{filteredBooks.length} kitap listeleniyor</p>
        </div>
        <button
          onClick={() => {
            if (tab !== 'list') {
              setTab('list')
              setEditingBook(null)
            } else {
              setTab('add')
              setForm({ title: '', author: '', price: '', stock: '', isbn: '', category: '', cover: '', description: '' })
            }
          }}
          className={`flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${tab === 'list' ? 'bg-primary' : 'bg-destructive'}`}
        >
          {tab === 'list' ? <PlusIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
          {tab === 'list' ? 'Yeni Kitap Ekle' : 'İptal'}
        </button>
      </div>

      {tab === 'list' ? (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Kitap veya yazar ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary shadow-sm"
            />
          </div>

          <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Kitap</th>
                  <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Kategori</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Fiyat</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Stok</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBooks.map((book) => (
                  <tr 
                    key={book.id} 
                    onClick={() => handleEdit(book)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded-md overflow-hidden bg-muted shrink-0 relative shadow-sm border border-border">
                          <Image src={book.cover} alt={book.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded bg-muted text-[10px] font-bold text-muted-foreground">{book.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-foreground">₺{book.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-sm text-foreground">{book.stock}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 hover:bg-primary/10 rounded-md text-primary transition-colors"><EditIcon className="w-4 h-4" /></button>
                        <button 
                          onClick={(e) => handleDelete(book.id, e)}
                          className="p-1.5 hover:bg-destructive/10 rounded-md text-destructive transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-300">
          <div className="md:col-span-1 space-y-4">
            <label className="block text-xs font-bold uppercase text-muted-foreground">Kitap Kapağı</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[3/4] bg-muted/30 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden relative group"
            >
              {form.cover ? (
                <Image src={form.cover} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="text-center">
                  <UploadIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Görsel Seç</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-border p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <input placeholder="Kitap Adı *" className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-primary" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Yazar *" className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-primary" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
                
                <select 
                  className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-primary bg-white appearance-none cursor-pointer"
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                >
                  <option value="" disabled>Kategori Seçin *</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="Yeni Kategori">+ Yeni Kategori Ekle (Elle Yaz)</option>
                </select>
              </div>

              {form.category === 'Yeni Kategori' && (
                <input 
                  placeholder="Yeni Kategori Adı *" 
                  className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-primary animate-in fade-in slide-in-from-top-1 bg-primary/5 font-bold" 
                  onChange={e => setForm({...form, category: e.target.value})} 
                />
              )}

              <div className="grid grid-cols-3 gap-4">
                <input type="number" step="0.01" placeholder="Fiyat *" className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-primary" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                <input type="number" placeholder="Stok *" className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-primary" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                <input placeholder="ISBN" className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-primary" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} />
              </div>
              <textarea rows={4} placeholder="Açıklama" className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:border-primary resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="flex-1 bg-primary text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors">
                {loading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : (tab === 'edit' ? <EditIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />)}
                {tab === 'edit' ? 'Değişiklikleri Kaydet' : 'Kitabı Ekle'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setTab('list')
                  setEditingBook(null)
                }} 
                className="px-10 py-4 border border-border rounded-xl font-bold hover:bg-muted transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
