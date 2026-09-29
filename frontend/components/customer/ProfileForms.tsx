'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useApp } from '@/lib/store'
import { ApiError, errorMessage } from '@/lib/api'

const inputClass =
  'w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30'
const labelClass = 'block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1'

/** Profil bilgilerini ve şifreyi backend üzerinden güncelleyen formlar. */
export default function ProfileForms() {
  const { userName, userEmail, userPhone, userAddress, updateProfile, addToast } = useApp()

  const [info, setInfo] = useState({ name: userName, email: userEmail, phone: userPhone, address: userAddress })
  const [infoBusy, setInfoBusy] = useState(false)
  const [infoError, setInfoError] = useState<string | null>(null)

  const [pw, setPw] = useState({ current: '', next: '' })
  const [pwBusy, setPwBusy] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)

  const saveInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setInfoError(null)
    setInfoBusy(true)
    try {
      await updateProfile(info)
      addToast('Bilgileriniz güncellendi.', 'success')
    } catch (error) {
      setInfoError(errorMessage(error))
    } finally {
      setInfoBusy(false)
    }
  }

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError(null)
    setPwBusy(true)
    try {
      await updateProfile({ current_password: pw.current, password: pw.next })
      setPw({ current: '', next: '' })
      addToast('Şifreniz değiştirildi.', 'success')
    } catch (error) {
      setPwError(error instanceof ApiError ? error.message : errorMessage(error))
    } finally {
      setPwBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={saveInfo} className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-lg font-bold text-foreground">Hesap Bilgileri</h2>
        </div>

        {infoError && <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">{infoError}</div>}

        <div><label className={labelClass}>Ad Soyad</label>
          <input className={inputClass} value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} /></div>
        <div><label className={labelClass}>E-posta Adresi</label>
          <input type="email" className={inputClass} value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} /></div>
        <div><label className={labelClass}>Telefon</label>
          <input className={inputClass} value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} /></div>
        <div><label className={labelClass}>Teslimat Adresi</label>
          <textarea rows={3} className={`${inputClass} resize-none`} value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} /></div>

        <button type="submit" disabled={infoBusy} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2">
          {infoBusy && <Loader2 className="w-4 h-4 animate-spin" />} Bilgilerimi Güncelle
        </button>
      </form>

      <form onSubmit={savePassword} className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-foreground">Şifre Değiştir</h2>

        {pwError && <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">{pwError}</div>}

        <div><label className={labelClass}>Mevcut Şifre</label>
          <input type="password" className={inputClass} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></div>
        <div><label className={labelClass}>Yeni Şifre</label>
          <input type="password" placeholder="En az 8 karakter, harf ve rakam" className={inputClass} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>

        <button type="submit" disabled={pwBusy || !pw.current || !pw.next} className="w-full border border-border hover:bg-muted disabled:opacity-50 text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2">
          {pwBusy && <Loader2 className="w-4 h-4 animate-spin" />} Şifreyi Değiştir
        </button>
      </form>
    </div>
  )
}
