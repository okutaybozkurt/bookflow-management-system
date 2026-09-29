'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react'
import { useApp } from '@/lib/store'
import { ApiError, errorMessage } from '@/lib/api'
import { usersApi, type ManagedUser } from '@/lib/services'

type Role = 'customer' | 'admin'
const ROLE_LABEL: Record<Role, string> = { admin: 'Yönetici', customer: 'Müşteri' }
const EMPTY_FORM = { name: '', email: '', role: 'customer' as Role, password: '' }

export default function KullaniciYonetimi() {
  const { addToast, userId } = useApp()
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<ManagedUser | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const load = useCallback(async () => {
    try {
      setUsers(await usersApi.list())
    } catch (error) {
      addToast(errorMessage(error, 'Kullanıcılar yüklenemedi.'), 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { load() }, [load])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!form.name || !form.email || (!editingUser && !form.password)) {
      setFormError('Lütfen zorunlu alanları doldurun.')
      return
    }

    setSaving(true)
    try {
      if (editingUser) {
        await usersApi.update(editingUser.id, {
          name: form.name, email: form.email, role: form.role,
          ...(form.password ? { password: form.password } : {}),
        })
        addToast('Kullanıcı başarıyla güncellendi', 'success')
      } else {
        await usersApi.create({ ...form })
        addToast('Yeni kullanıcı başarıyla eklendi', 'success')
      }
      closeModal()
      await load()
    } catch (error) {
      // Doğrulama hataları (ör. e-posta zaten kayıtlı) formda gösterilir.
      setFormError(error instanceof ApiError ? error.message : errorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (user: ManagedUser) => {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, role: user.role, password: '' })
    setFormError(null)
    setShowAddModal(true)
  }

  const handleDelete = async (user: ManagedUser) => {
    try {
      await usersApi.remove(user.id)
      addToast('Kullanıcı başarıyla silindi', 'success')
      await load()
    } catch (error) {
      addToast(errorMessage(error, 'Kullanıcı silinemedi.'), 'error')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const openNewUserModal = () => {
    setEditingUser(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingUser(null)
    setForm(EMPTY_FORM)
    setFormError(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Kullanıcı Yönetimi</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Yükleniyor...' : `${users.length} kullanıcı listeleniyor`}
          </p>
        </div>
        <button
          onClick={openNewUserModal}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Kullanıcı Ekle
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Kullanıcı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Ad Soyad</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Email</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Rol</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Kayıt Tarihi</th>
              <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Sipariş</th>
              <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredUsers.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">Kullanıcı bulunamadı.</td></tr>
            )}
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {ROLE_LABEL[user.role]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{user.createdAt.slice(0, 10)}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground text-right hidden md:table-cell">{user.ordersCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleEdit(user)}
                      className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-primary/10 text-primary transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user)}
                      disabled={user.id === userId}
                      title={user.id === userId ? 'Kendi hesabınızı silemezsiniz' : 'Sil'}
                      className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{formError}</div>
              )}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Ad Soyad</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ad ve soyadı girin"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@bookflow.com"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Rol</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                  disabled={editingUser?.id === userId}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary bg-white disabled:opacity-60"
                >
                  <option value="customer">Müşteri</option>
                  <option value="admin">Yönetici</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Şifre {editingUser && <span className="font-normal text-muted-foreground">(değiştirmek istemiyorsanız boş bırakın)</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="En az 8 karakter, harf ve rakam"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingUser ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
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
              <p className="text-sm text-muted-foreground">
                <strong>{deleteConfirm.name}</strong> silinecek ve hesabına artık giriş yapılamayacak. Geçmiş siparişleri korunur.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
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
