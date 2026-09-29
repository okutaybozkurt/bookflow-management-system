'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Search, X, TrendingUp, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useApp } from '@/lib/store'

export default function AdvancedSearch() {
  const { books, categories, openBook, setCatalogSearch, setCustomerView } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // En çok satanlar: gerçek sipariş verisinden (satışı olmayan kitap listelenmez)
  const topSellers = useMemo(() => {
    return [...books].filter((b) => b.sold > 0).sort((a, b) => b.sold - a.sold).slice(0, 4)
  }, [books])

  // Öneriler de katalogdan türetilir: kitabı olan kategoriler ve çok satan yazarlar
  const suggestions = useMemo(() => {
    const cats = categories.filter((c) => (c.booksCount ?? 0) > 0).slice(0, 4).map((c) => c.name)
    const authors = [...new Set(topSellers.map((b) => b.author))].slice(0, 2)
    return [...cats, ...authors]
  }, [categories, topSellers])

  // Arama sonuçları
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return books.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8)
  }, [books, searchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // "Ara" / Enter: aramayı vitrine uygular ve sonuçları kitap listesinde gösterir
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCatalogSearch(searchQuery.trim())
    setCustomerView('home')
    setIsOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <form onSubmit={submitSearch} className="flex-1 flex items-center gap-2 max-w-2xl mx-auto relative">
      <div className="relative flex-1" ref={inputRef}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Kitap veya yazar ara..."
          className="w-full pl-11 pr-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm bg-muted/30"
        />

        {/* Search Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {!searchQuery.trim() ? (
              /* Arama Yapılmamışken: Öneriler ve Çok Satanlar */
              <div className="p-5 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Öneriler</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1.5 bg-muted hover:bg-primary hover:text-white text-xs font-medium rounded-full transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {topSellers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">En Çok Satanlar</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {topSellers.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => {
                          openBook(book)
                          setIsOpen(false)
                        }}
                        className="flex gap-3 p-2 rounded-xl hover:bg-primary/5 transition-all text-left group border border-transparent hover:border-primary/10"
                      >
                        <div className="w-12 h-16 bg-muted rounded-lg overflow-hidden shrink-0 relative shadow-sm">
                          <Image src={book.cover} alt={book.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{book.title}</p>
                          <p className="text-[10px] text-muted-foreground">{book.author}</p>
                          <p className="text-xs font-bold text-primary mt-1">₺{book.price.toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </div>
            ) : (
              /* Yazmaya Başlayınca: Gerçek Sonuçlar */
              <div className="p-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">Arama Sonuçları ({searchResults.length})</h3>
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => {
                          openBook(book)
                          setIsOpen(false)
                          setSearchQuery('')
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-colors text-left group"
                      >
                        <div className="w-10 h-14 bg-muted rounded-md overflow-hidden shrink-0 relative shadow-sm">
                          <Image src={book.cover} alt={book.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                          <p className="text-xs font-bold text-primary mt-0.5">₺{book.price.toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">Sonuç bulunamadı.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Ara</span>
      </button>
    </form>
  )
}
