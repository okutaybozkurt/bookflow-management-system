'use client'

import { useState } from 'react'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { useApp } from '@/lib/store'

interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Personel' | 'Müşteri'
  registrationDate: string
}

const mockUsers: User[] = [
  { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@bookflow.com', role: 'Admin', registrationDate: '2024-01-15' },
  { id: '2', name: 'Fatma Kaya', email: 'fatma@bookflow.com', role: 'Personel', registrationDate: '2024-02-20' },
  { id: '3', name: 'Mehmet Demir', email: 'mehmet@bookflow.com', role: 'Personel', registrationDate: '2024-03-10' },
  { id: '4', name: 'Zeynep Şimşek', email: 'zeynep@bookflow.com', role: 'Müşteri', registrationDate: '2024-04-05' },
]

export default function KullaniciYonetimi() {
  const { addToast } = useApp()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Müşteri' as 'Admin' | 'Personel' | 'Müşteri',
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.email) {
      addToast('Lütfen tüm alanları doldurun', 'error')
      return
    }

    if (editingUser) {
      // Update existing
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: form.name, email: form.email, role: form.role }
            : u
        )
      )
      addToast('Kullanıcı başarıyla güncellendi', 'success')
    } else {
      // Add new
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: form.name,
        email: form.email,
        role: form.role,
        registrationDate: new Date().toISOString().split('T')[0],
      }
      setUsers([...users, newUser])
      addToast('Yeni kullanıcı başarıyla eklendi', 'success')
    }

    setForm({ name: '', email: '', role: 'Müşteri' })
    setEditingUser(null)
    setShowAddModal(false)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, role: user.role })
    setShowAddModal(true)
  }

  const handleDelete = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
    setDeleteConfirm(null)
    addToast('Kullanıcı başarıyla silindi', 'success')
  }

  const openNewUserModal = () => {
    setEditingUser(null)
    setForm({ name: '', email: '', role: 'Müşteri' })
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingUser(null)
    setForm({ name: '', email: '', role: 'Müşteri' })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Kullanıcı/Personel Yönetimi</h1>
          <p className="text-sm text-muted-foreground">{users.length} kullanıcı listeleniyor</p>
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
              <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
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
                      user.role === 'Admin'
                        ? 'bg-red-100 text-red-700'
                        : user.role === 'Personel'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{user.registrationDate}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleEdit(user)}
                      className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-primary/10 text-primary transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user.id)}
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

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
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
                  onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary bg-white"
                >
                  <option>Admin</option>
                  <option>Personel</option>
                  <option>Müşteri</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
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
              <p className="text-sm text-muted-foreground">Bu kullanıcı silinecektir. Bu işlem geri alınamaz.</p>

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
