'use client'

import { useCallback, useEffect, useState } from 'react'
import { Star, Trash2, Loader2 } from 'lucide-react'
import { useApp } from '@/lib/store'
import { errorMessage } from '@/lib/api'
import { reviewsApi, type Review } from '@/lib/services'
import { cn } from '@/lib/utils'

/** Kitap yorumları: listeleme, ekleme, güncelleme ve silme (backend'e bağlı). */
export default function BookReviews({ bookId }: { bookId: string }) {
  const { userRole, userId, userName, addToast, refreshCatalog, setAuthModalOpen } = useApp()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      setReviews(await reviewsApi.list(bookId))
    } catch (error) {
      addToast(errorMessage(error, 'Yorumlar yüklenemedi.'), 'error')
    } finally {
      setLoading(false)
    }
  }, [bookId, addToast])

  useEffect(() => { setLoading(true); load() }, [load])

  const mine = reviews.find((r) => String(r.user?.id) === userId)
  const isAdmin = userRole === 'admin'

  // Mevcut yorumu düzenlemek için forma yükle.
  useEffect(() => {
    if (mine) { setRating(mine.rating); setComment(mine.comment ?? '') }
  }, [mine?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const afterChange = async () => {
    await Promise.all([load(), refreshCatalog()]) // ortalama puan güncellensin
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userRole === 'guest') return setAuthModalOpen(true)
    setBusy(true)
    try {
      if (mine) await reviewsApi.update(mine.id, { rating, comment })
      else await reviewsApi.create(bookId, { rating, comment })
      addToast(mine ? 'Yorumunuz güncellendi.' : 'Yorumunuz eklendi.', 'success')
      await afterChange()
    } catch (error) {
      addToast(errorMessage(error, 'Yorum kaydedilemedi.'), 'error')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (review: Review) => {
    if (!confirm('Bu yorum silinsin mi?')) return
    try {
      await reviewsApi.remove(review.id)
      if (review.id === mine?.id) { setRating(5); setComment('') }
      addToast('Yorum silindi.', 'success')
      await afterChange()
    } catch (error) {
      addToast(errorMessage(error, 'Yorum silinemedi.'), 'error')
    }
  }

  return (
    <section className="mb-12 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h2 className="text-lg font-bold text-foreground">Yorumlar</h2>
        <span className="text-sm text-muted-foreground">({reviews.length})</span>
      </div>

      <form onSubmit={submit} className="bg-white border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold text-muted-foreground mr-2">
            {mine ? 'Yorumunuzu düzenleyin' : `Puanınız${userName ? ` (${userName})` : ''}`}
          </span>
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} type="button" onClick={() => setRating(s)} aria-label={`${s} yıldız`}>
              <Star className={cn('w-5 h-5', s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30')} />
            </button>
          ))}
        </div>
        <textarea
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={userRole === 'guest' ? 'Yorum yazmak için giriş yapın' : 'Kitap hakkında ne düşünüyorsunuz?'}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-primary resize-none"
        />
        <button type="submit" disabled={busy} className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {userRole === 'guest' ? 'Giriş Yap' : mine ? 'Yorumu Güncelle' : 'Yorum Gönder'}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground">Yorumlar yükleniyor...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz yorum yok. İlk yorumu siz yazın!</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{r.user?.name ?? 'Kullanıcı'}</span>
                  <span className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={cn('w-3.5 h-3.5', s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30')} />
                    ))}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                {(r.id === mine?.id || isAdmin) && (
                  <button onClick={() => remove(r)} className="text-red-500 hover:bg-red-50 rounded p-1" aria-label="Yorumu sil">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {r.comment && <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
