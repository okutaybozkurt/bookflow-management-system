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
              <svg className="w-5 h-5 mb-0.5" fill="currentColor" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69.03-8.14-1.05-13.36-3.22-5.22-2.16-9.91-3.25-14.07-3.25-4.4 0-9.2 1.1-14.4 3.28-5.2 2.18-9.41 3.32-12.65 3.42-5.21.12-10.22-2-15.04-6.39-2.89-2.51-6.64-7.03-11.24-13.56-11.14-16.11-16.71-33.89-16.71-53.32 0-11.33 2.51-21.1 7.54-29.31 5.03-8.21 11.83-14.61 20.38-19.21 8.56-4.6 17.57-6.93 27.04-6.99 4.3 0 9.35 1.12 15.16 3.36 5.81 2.24 10.03 3.36 12.65 3.36 2.13 0 6.64-1.28 13.56-3.85 5.37-2.02 10.02-3.03 13.97-3.03 13.12.25 23.94 4.88 32.47 13.88-11.45 6.91-17.18 16.63-17.18 29.15 0 10.42 3.86 19.34 11.58 26.76 3.6 3.46 7.9 6.13 12.89 8.01-1.31 3.73-2.87 7.46-4.68 11.19zM113.47 24.1c0 5.86-2.22 11.45-6.67 16.77-4.45 5.32-9.7 8.92-15.75 10.81-1.04.34-2.13.51-3.25.51-1.03 0-1.83-.24-2.4-.73-.08-.07-.12-.13-.15-.2-.03-.07-.05-.13-.05-.2 0-.25.13-.67.4-1.26 1.94-4.22 4.95-8.5 9.03-12.84 4.08-4.34 9.12-7.85 15.11-10.53 1.1-.5 2.1-.75 3.01-.75 1.25 0 2.2.49 2.84 1.48.51.78.76 1.61.76 2.48z" />
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
