'use client'

import { Heart, ArrowLeft } from 'lucide-react'
import { useApp } from '@/lib/store'
import BookCard from './BookCard'

export default function FavoritesPage() {
  const { books, favoriteIds, setCustomerView } = useApp()

  const favoriteBooks = books.filter((b) => favoriteIds.has(b.id))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => setCustomerView('home')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Ana Sayfaya Dön
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-primary rounded-full" />
        <h1 className="text-2xl font-bold text-foreground">Favorilerim</h1>
        <span className="text-sm text-muted-foreground font-normal">
          ({favoriteBooks.length} kitap)
        </span>
      </div>

      {favoriteBooks.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-16">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Heart className="w-9 h-9 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Favori listeniz boş</h2>
            <p className="text-muted-foreground text-sm">
              Kitap kartlarındaki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
            </p>
          </div>
          <button
            onClick={() => setCustomerView('home')}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Kitaplara Gözat
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {favoriteBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
