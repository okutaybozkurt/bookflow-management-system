'use client'

import { useState } from 'react'
import { useApp } from '@/lib/store'
import BookCard from './BookCard'
import CategoryBar from './CategoryBar'

export default function BooksGrid() {
  const { books, catalogLoading, catalogError, refreshCatalog } = useApp()
  const [activeCategory, setActiveCategory] = useState('Hepsi')

  const filteredBooks = activeCategory === 'Hepsi' 
    ? books 
    : books.filter(book => book.category === activeCategory)

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <CategoryBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-foreground text-white p-8 mb-8">
        <div className="relative z-10">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Keşfet</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Kitap Dünyasına Hoş Geldiniz</h2>
          <p className="text-white/60 text-sm max-w-md">
            Binlerce kitap arasından aradığını bul, favorilerine ekle ve hemen sipariş ver.
          </p>
        </div>
        {/* Decorative */}
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10 flex items-center justify-center text-9xl select-none pointer-events-none">
          📚
        </div>
      </div>

      {/* Section title */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h3 className="text-lg font-bold text-foreground">Kitaplar</h3>
        </div>
      </div>

      {catalogLoading && <p className="py-12 text-center text-muted-foreground">Kitaplar yükleniyor...</p>}
      {catalogError && (
        <div className="py-8 text-center space-y-3">
          <p className="text-red-600 text-sm">{catalogError}</p>
          <button onClick={refreshCatalog} className="text-sm text-primary font-medium hover:underline">Tekrar dene</button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredBooks.map((book, idx) => (
          <BookCard key={book.id} book={book} priority={idx < 2} />
        ))}
      </div>
      {!catalogLoading && !catalogError && filteredBooks.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Seçili kategoride kitap bulunamadı.</p>
        </div>
      )}

      {/* More section */}
      <div className="mt-10 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h3 className="text-lg font-bold text-foreground">Yeni Çıkanlar</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {books.slice(0, 6).map((book) => (
          <BookCard key={'new-' + book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
