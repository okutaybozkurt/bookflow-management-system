'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useApp } from '@/lib/store'
import { Book } from '@/lib/data'
import { cn } from '@/lib/utils'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const { userRole, addToCart, favoriteIds, toggleFavorite, openBook, addToast } = useApp()
  const [added, setAdded] = useState(false)
  const isFav = favoriteIds.has(book.id)
  const isLoggedIn = userRole !== 'guest'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(book)
    addToast(`"${book.title}" sepete eklendi!`, 'success')
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(book.id)
  }

  const rating = 4 + Math.random() * 0.9
  const reviewCount = Math.floor(100 + Math.random() * 900)

  return (
    <div
      onClick={() => openBook(book)}
      className="bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group cursor-pointer"
    >
      {/* Cover */}
      <div className="relative overflow-hidden bg-muted aspect-[3/4]">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
        {/* Favorite button */}
        {isLoggedIn && (
          <button
            onClick={handleToggleFavorite}
            className={cn(
              'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all',
              isFav
                ? 'bg-primary text-white'
                : 'bg-white/90 text-muted-foreground hover:bg-primary hover:text-white'
            )}
          >
            <Heart className={cn('w-4 h-4', isFav && 'fill-current')} />
          </button>
        )}
        {/* Category badge */}
        <div className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {book.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">{book.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  'w-3 h-3',
                  s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">({reviewCount.toLocaleString('tr-TR')})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-bold text-foreground">
              {book.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-muted-foreground ml-0.5">TL</span>
          </div>
          <button
            onClick={(e) => handleAddToCart(e)}
            className={cn(
              'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all',
              added
                ? 'bg-green-500 text-white'
                : 'bg-primary hover:bg-primary/90 text-white'
            )}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {added ? 'Eklendi!' : 'Sepete Ekle'}
          </button>
        </div>
      </div>
    </div>
  )
}
