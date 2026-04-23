'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import { useApp } from '@/lib/store'

const popularSearches = [
  'Kaybolan Şehir',
  'Saatleri Ayarlama Enstitüsü',
  'KPSS 2024',
  'Çocuk Hikayeleri',
  'Dune',
  'Sherlock Holmes',
]

const topSellers = [
  { id: '1', title: 'Kaybolan Şehir', author: 'Ahmet Altan', price: 189.90, cover: '/books/book1.jpg' },
  { id: '2', title: 'Sessiz Fırtına', author: 'Asli Şit', price: 145.00, cover: '/books/book2.jpg' },
  { id: '3', title: 'Kuantum Dünyası', author: 'Brian Greene', price: 235.50, cover: '/books/book3.jpg' },
  { id: '4', title: 'Aşkın Rengi', author: 'İbrahim Öztürk', price: 180.00, cover: '/books/book4.jpg' },
]

export default function AdvancedSearch() {
  const { books, openBook } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSearches, setFilteredSearches] = useState(popularSearches)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    if (value.trim()) {
      setFilteredSearches(
        popularSearches.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
      )
    } else {
      setFilteredSearches(popularSearches)
    }
  }

  const handleSearchResult = (term: string) => {
    setSearchQuery(term)
    setIsOpen(false)
  }

  return (
    <div className="flex-1 flex items-center gap-2 max-w-2xl mx-auto relative">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Kitap, yazar, kategori ara... (KitapÜssü'nde)"
          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-l-md text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        />

        {/* Search Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            {/* Popüler Aramalar */}
            {filteredSearches.length > 0 && (
              <div className="p-4 border-b border-border">
                <h3 className="text-xs font-bold text-foreground mb-3 uppercase tracking-widest text-muted-foreground">
                  Popüler Aramalar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filteredSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearchResult(search)}
                      className="px-3 py-1.5 bg-muted hover:bg-primary hover:text-white text-xs font-medium rounded-full transition-colors"
                    >
                      {search}
                    </button>
                  )
                })}
                </div>
              </div>
            )}

            {/* Haftanın En Çok Satanları */}
            <div className="p-4">
              <h3 className="text-xs font-bold text-foreground mb-3 uppercase tracking-widest text-muted-foreground">
                Haftanın En Çok Satanları
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {topSellers.map((book) => {
                  const fullBook = books.find((b) => b.id === book.id)
                  return (
                  <button
                    key={book.id}
                    onClick={() => {
                      setIsOpen(false)
                      if (fullBook) openBook(fullBook)
                      else handleSearchResult(book.title)
                    }}
                    className="flex gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left group"
                  >
                    <div className="w-12 h-16 bg-muted rounded overflow-hidden shrink-0">
                      <Image
                        src={book.cover}
                        alt={book.title}
                        width={48}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground line-clamp-2 group-hover:text-primary">
                        {book.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{book.author}</p>
                      <p className="text-xs font-bold text-primary mt-1">₺{book.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-r-md text-sm font-medium transition-colors flex items-center gap-2">
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Ara</span>
      </button>
    </div>
  )
}
