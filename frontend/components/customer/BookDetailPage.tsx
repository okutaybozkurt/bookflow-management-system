'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Heart, ShoppingCart, Star, BookOpen, Calendar, Globe, Hash, Layers } from 'lucide-react'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'
import BookCard from './BookCard'

export default function BookDetailPage() {
  const { selectedBook, books, setCustomerView, addToCart, favoriteIds, toggleFavorite, addToast, userRole } = useApp()
  const [addedToCart, setAddedToCart] = useState(false)

  if (!selectedBook) {
    setCustomerView('home')
    return null
  }

  const book = selectedBook
  const isFav = favoriteIds.has(book.id)
  const isLoggedIn = userRole !== 'guest'
  const related = books.filter((b) => b.category === book.category && b.id !== book.id).slice(0, 6)

  const rating = 4.3
  const reviewCount = 1248

  const handleAddToCart = () => {
    addToCart(book)
    addToast(`"${book.title}" sepete eklendi!`, 'success')
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleToggleFavorite = () => {
    toggleFavorite(book.id)
    addToast(
      isFav ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi!',
      isFav ? 'info' : 'success'
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => setCustomerView('home')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Geri Dön
      </button>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Cover */}
        <div className="shrink-0 flex justify-center md:justify-start">
          <div className="w-48 h-64 relative rounded-xl overflow-hidden shadow-lg bg-muted">
            <Image
              src={book.cover}
              alt={book.title}
              fill
              priority
              className="object-cover"
              sizes="192px"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
              {book.category}
            </span>
            <h1 className="text-2xl font-bold text-foreground mt-3 leading-snug">{book.title}</h1>
            <p className="text-muted-foreground mt-1">{book.author}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn('w-4 h-4', s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30')}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount.toLocaleString('tr-TR')} yorum)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">
              {book.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-lg text-muted-foreground">TL</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{book.description}</p>

          {/* Book details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">

            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="w-4 h-4 shrink-0" />
              <span className="text-xs">{book.isbn}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="w-4 h-4 shrink-0" />
              <span className={book.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                {book.stock > 0 ? `${book.stock} adet stokta` : 'Stok tükendi'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all text-sm',
                addedToCart
                  ? 'bg-green-500 text-white'
                  : book.stock === 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-white'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {addedToCart ? 'Sepete Eklendi!' : book.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
            </button>

            {isLoggedIn && (
              <button
                onClick={handleToggleFavorite}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all',
                  isFav
                    ? 'border-primary bg-primary text-white'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                )}
              >
                <Heart className={cn('w-5 h-5', isFav && 'fill-current')} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Related Books */}
      {related.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-lg font-bold text-foreground">Bu Kategorideki Diğer Kitaplar</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {related.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
