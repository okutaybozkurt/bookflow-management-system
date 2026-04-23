'use client'

import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Eye, X } from 'lucide-react'
import Image from 'next/image'
import { useApp } from '@/lib/store'

type Tab = 'list' | 'add'

export default function KitapYonetimi() {
  const { books, addToast } = useApp()
  const [tab, setTab] = useState<Tab>('list')
  const [submitted, setSubmitted] = useState(false)
  const [editingBook, setEditingBook] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    isbn: '',
    pages: '',
    publishDate: '',
    language: 'Türkçe',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    addToast('Kitap başarıyla eklendi!', 'success')
    setTimeout(() => {
      setSubmitted(false)
      setTab('list')
      setForm({ title: '', author: '', price: '', stock: '', isbn: '', pages: '', publishDate: '', language: 'Türkçe', description: '' })
    }, 1500)
  }

  const handleEditBook = (book: any) => {
    setEditingBook(book)
    setForm({
      title: book.title,
      author: book.author,
      price: book.price.toString(),
      stock: book.stock.toString(),
      isbn: book.isbn,
      pages: book.pages.toString(),
      publishDate: book.publishDate,
      language: book.language,
      description: book.description,
    })
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    addToast('Kitap başarıyla güncellendi!', 'success')
    setEditingBook(null)
  }

  const handleDeleteBook = (bookId: string) => {
    addToast('Kitap başarıyla silindi!', 'success')
    setDeleteConfirm(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Kitap Yönetimi</h1>
          <p className="text-sm text-muted-foreground">{books.length} kitap listeleniyor</p>
        </div>
        <button
          onClick={() => setTab(tab === 'add' ? 'list' : 'add')}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Kitap Ekle
        </button>
      </div>

      {tab === 'list' ? (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Kitap ara..."
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Kitap</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Kategori</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Fiyat</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Stok</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Satış</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, i) => (
                  <tr key={book.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded-md overflow-hidden bg-muted shrink-0">
                          <Image src={book.cover} alt={book.title} width={40} height={56} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground line-clamp-1">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">{book.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      ₺{book.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-foreground hidden sm:table-cell">{book.stock}</td>
                    <td className="px-4 py-3 text-right text-sm text-foreground hidden sm:table-cell">{book.sold.toLocaleString('tr-TR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-blue-50 text-blue-500 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditBook(book)}
                          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-primary/10 text-primary transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(book.id)}
                          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        /* Add Book Form */
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Info */}
          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Temel Bilgiler
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Kitap Adı *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Kitap başlığını girin"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Yazar Adı *</label>
                <input
                  type="text"
                  required
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Yazar adını girin"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Fiyat (TL) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₺</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Stok Miktarı *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>

          {/* Detail Section */}
          <div className="bg-white rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Kitap Detayları
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">ISBN</label>
                <input
                  type="text"
                  value={form.isbn}
                  onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                  placeholder="978-975-xxx-xxx-x"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Sayfa Sayısı</label>
                <input
                  type="number"
                  min="1"
                  value={form.pages}
                  onChange={(e) => setForm({ ...form, pages: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Yayın Tarihi</label>
                <input
                  type="date"
                  value={form.publishDate}
                  onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Dil</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary bg-white"
                >
                  <option>Türkçe</option>
                  <option>İngilizce</option>
                  <option>Almanca</option>
                  <option>Fransızca</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-foreground mb-1.5">Açıklama</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Kitap hakkında kısa bir açıklama..."
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all ${
                submitted ? 'bg-green-500' : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {submitted ? '✓ Kitap Eklendi!' : '+ Kitap Ekle'}
            </button>
            <button
              type="button"
              onClick={() => setTab('list')}
              className="px-6 py-2.5 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Kitap Düzenle</h2>
              <button
                onClick={() => setEditingBook(null)}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Kitap Adı</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Kitap başlığını girin"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Yazar Adı</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Yazar adını girin"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Fiyat (TL)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₺</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Stok Miktarı</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  Güncelle
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="flex-1 border border-border hover:bg-muted text-foreground font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Emin misiniz?</h2>
              <p className="text-sm text-muted-foreground">Bu kitap silinecektir. Bu işlem geri alınamaz.</p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleDeleteBook(deleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  Sil
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-border hover:bg-muted text-foreground font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
