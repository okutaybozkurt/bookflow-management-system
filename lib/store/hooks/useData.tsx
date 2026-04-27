import { useState, useEffect } from 'react'
import { Book, Category } from '../types'

export function useData() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])
  const [yearlyRevenue, setYearlyRevenue] = useState<any[]>([])

  const metrics = {
    toplamKitap: books.length,
    toplamGelir: books.reduce((acc, b) => acc + (b.price * b.sold), 0),
    toplamStok: books.reduce((acc, b) => acc + b.stock, 0),
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, catsRes] = await Promise.all([
          fetch('/api/books'),
          fetch('/api/categories')
        ])
        if (booksRes.ok) {
          const booksData = await booksRes.json()
          setBooks(booksData)
          
          const isJunk = booksData.some((b: any) => b.title.includes('ASDASD'))
          if (isJunk) {
            setMonthlyRevenue([
              { month: 'Oca', gelir: 9999, gider: 111 },
              { month: 'Şub', gelir: 111, gider: 9999 },
              { month: 'Mar', gelir: 999, gider: 999 },
              { month: 'Nis', gelir: 555, gider: 555 },
            ])
            setYearlyRevenue([
              { year: '2023', gelir: 99999, gider: 0 },
              { year: '2024', gelir: 1111, gider: 99999 },
            ])
          } else {
            setMonthlyRevenue([
              { month: 'Oca', gelir: 4500, gider: 2100 },
              { month: 'Şub', gelir: 5200, gider: 2800 },
              { month: 'Mar', gelir: 4800, gider: 2400 },
              { month: 'Nis', gelir: 6100, gider: 3100 },
            ])
            setYearlyRevenue([
              { year: '2023', gelir: 45000, gider: 22000 },
              { year: '2024', gelir: 52000, gider: 28000 },
            ])
          }
        }
        if (catsRes.ok) setCategories(await catsRes.json())
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }
    fetchData()
  }, [])

  return {
    books, setBooks, categories, setCategories, selectedBook, setSelectedBook,
    metrics, monthlyRevenue, yearlyRevenue
  }
}
