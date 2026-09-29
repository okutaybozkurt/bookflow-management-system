'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '@/lib/store'
import { errorMessage } from '@/lib/api'

type Tab = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { signIn, signUp, addToast } = useApp()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const switchTab = (next: Tab) => {
    setTab(next)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password || (tab === 'register' && !name)) {
      setError('Lütfen tüm alanları doldurun.')
      return
    }

    setSubmitting(true)
    try {
      const user = tab === 'register'
        ? await signUp({ name, email, password })
        : await signIn(email, password)

      addToast(
        tab === 'register'
          ? 'Kayıt başarılı, hoş geldiniz!'
          : user.role === 'admin' ? 'Admin Paneline hoş geldiniz!' : 'Giriş başarılı!',
        'success'
      )
      setEmail('')
      setPassword('')
      setName('')
      onClose()
    } catch (err) {
      // API'nin döndürdüğü anlamlı mesaj (ör. "E-posta veya şifre hatalı.") formda gösterilir.
      setError(errorMessage(err, tab === 'register' ? 'Kayıt başarısız.' : 'Giriş başarısız.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-md overflow-y-auto py-8 sm:items-center">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200 my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {tab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'login'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'register'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Ad Soyad
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız ve soyadınız"
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Email Adresi
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@kitapussu.com"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {error && (
            <div role="alert" className="bg-red-50 border-l-2 border-red-400 p-3 rounded text-xs text-red-700">
              {error}
            </div>
          )}

          {tab === 'register' && (
            <p className="text-xs text-muted-foreground">Şifre en az 8 karakter olmalı, harf ve rakam içermelidir.</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors text-sm mt-6 shadow-lg shadow-primary/20"
          >
            {submitting ? 'Lütfen bekleyin...' : tab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </div>
  )
}
