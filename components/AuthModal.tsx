'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '@/lib/store'

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
  const { login, addToast } = useApp()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      addToast('Lütfen tüm alanları doldurun', 'error')
      return
    }

    // Role simulation logic
    const isAdmin = email === 'admin@kitapussu.com' && password === '1234'
    const role = isAdmin ? 'admin' : 'customer'

    login(role, email, tab === 'register' ? name : undefined)
    addToast(
      isAdmin ? 'Admin Paneline hoş geldiniz!' : 'Giriş başarılı!',
      'success'
    )

    // Reset form and close
    setEmail('')
    setPassword('')
    setName('')
    onClose()
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
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'login'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setTab('register')}
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

          {/* Dev Note */}
          <div className="bg-blue-50 border-l-2 border-blue-400 p-3 rounded text-xs text-blue-800">
            <span className="font-semibold">Test için:</span> &apos;admin@kitapussu.com&apos; girilirse Admin Paneli, diğer tüm girişlerde Müşteri Paneli açılır.
          </div>

          {/* Social Login */}
          <div className="space-y-2">
            <button
              type="button"
              className="w-full border border-border hover:bg-muted text-foreground font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google ile Giriş Yap
            </button>
            <button
              type="button"
              className="w-full bg-black hover:bg-black/90 text-white font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 13.5c-.65 0-1.19.13-1.7.36.34-1.05.55-2.18.55-3.36 0-5.18-4.04-9.42-9.02-9.42-.48 0-.94.04-1.4.12 1.49-1.19 3.42-1.89 5.52-1.89 5.85 0 10.6 4.75 10.6 10.6 0 2.59-.94 4.95-2.49 6.8-.36-.09-.73-.14-1.11-.14zm-13.8-.55c-.48-.96-.76-2.04-.76-3.2 0-4.04 3.13-7.31 6.99-7.31.98 0 1.92.19 2.78.52-.34 1.05-.55 2.18-.55 3.36 0 5.18 4.04 9.42 9.02 9.42.48 0 .94-.04 1.4-.12-1.49 1.19-3.42 1.89-5.52 1.89-5.85 0-10.6-4.75-10.6-10.6 0-1.19.21-2.34.58-3.42.06.06.14.06.2.06.6 0 1.12-.47 1.12-1.06 0-.6-.47-1.08-1.06-1.08-.6 0-1.08.48-1.08 1.08 0 .47.32.87.74 1.02z" />
              </svg>
              Apple ile Giriş Yap
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors text-sm mt-6 shadow-lg shadow-primary/20"
          >
            {tab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </div>
  )
}
