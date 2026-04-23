'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type UserRole = 'guest' | 'customer' | 'admin'
export type CustomerView = 'home' | 'categories' | 'cart' | 'favorites' | 'profile' | 'book-detail'
export type AdminPage = 'dashboard' | 'inventory' | 'orders' | 'customers' | 'reports' | 'income-expense' | 'settings'

interface Book {
  id: string
  title: string
  author: string
  price: number
  stock: number
  sold: number
  cover: string
  category: string
  description: string
  isbn?: string
}

interface Category {
  id: string
  name: string
}

interface CartItem extends Book {
  quantity: number
}

interface AppContextType {
  // Auth
  userRole: UserRole
  userEmail: string
  userName: string
  login: (role: UserRole, email: string, name?: string) => void
  logout: () => void

  // Navigation
  customerView: CustomerView
  setCustomerView: (view: CustomerView) => void
  adminPage: AdminPage
  setAdminPage: (page: AdminPage) => void
  isAdminView: boolean
  setIsAdminView: (v: boolean) => void

  // Data
  books: Book[]
  categories: Category[]
  metrics: {
    toplamKitap: number
    toplamGelir: number
    toplamStok: number
  }
  monthlyRevenue: any[]
  yearlyRevenue: any[]
  cart: CartItem[]
  favoriteIds: Set<string>
  addToCart: (book: Book) => void
  removeFromCart: (bookId: string) => void
  updateCartQuantity: (bookId: string, quantity: number) => void
  toggleFavorite: (bookId: string) => void
  openBook: (book: Book) => void
  selectedBook: Book | null

  // UI
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('guest')
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [isAdminView, setIsAdminView] = useState(false)

  const [cart, setCart] = useState<CartItem[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([])
  const [customerView, setCustomerView] = useState<CustomerView>('home')
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const metrics = {
    toplamKitap: books.length,
    toplamGelir: books.reduce((acc, b) => acc + (b.price * b.sold), 0),
    toplamStok: books.reduce((acc, b) => acc + b.stock, 0),
  }

  const monthlyRevenue = [
    { month: 'Oca', gelir: 4500, gider: 2100 },
    { month: 'Şub', gelir: 5200, gider: 2800 },
    { month: 'Mar', gelir: 4800, gider: 2400 },
    { month: 'Nis', gelir: 6100, gider: 3100 },
  ]
  const yearlyRevenue = [
    { year: '2023', gelir: 45000, gider: 22000 },
    { year: '2024', gelir: 52000, gider: 28000 },
  ]

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole
    const savedEmail = localStorage.getItem('userEmail')
    const savedName = localStorage.getItem('userName')
    const savedIsAdminView = localStorage.getItem('isAdminView') === 'true'

    if (savedRole) setUserRole(savedRole)
    if (savedEmail) setUserEmail(savedEmail)
    if (savedName) setUserName(savedName)
    if (savedRole === 'admin') setIsAdminView(savedIsAdminView)

    const fetchData = async () => {
      try {
        const [booksRes, catsRes] = await Promise.all([
          fetch('/api/books'),
          fetch('/api/categories')
        ])
        if (booksRes.ok) setBooks(await booksRes.json())
        if (catsRes.ok) setCategories(await catsRes.json())
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (userRole !== 'guest') {
      localStorage.setItem('userRole', userRole)
      localStorage.setItem('userEmail', userEmail)
      localStorage.setItem('userName', userName)
      localStorage.setItem('isAdminView', isAdminView.toString())
    } else {
      localStorage.removeItem('userRole')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      localStorage.removeItem('isAdminView')
    }
  }, [userRole, userEmail, userName, isAdminView])

  const login = (role: UserRole, email: string, name?: string) => {
    setUserRole(role)
    setUserEmail(email)
    setUserName(name || email.split('@')[0])
    if (role === 'admin') setIsAdminView(true)
  }

  const logout = () => {
    setUserRole('guest')
    setUserEmail('')
    setUserName('')
    setIsAdminView(false)
    setAdminPage('dashboard')
  }

  const addToCart = (book: Book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === book.id)
      if (existing) {
        return prev.map((item) => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...book, quantity: 1 }]
    })
  }

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId))
  }

  const updateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId)
      return
    }
    setCart((prev) => prev.map((item) => item.id === bookId ? { ...item, quantity } : item))
  }

  const toggleFavorite = (bookId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(bookId)) next.delete(bookId)
      else next.add(bookId)
      return next
    })
  }

  const openBook = (book: Book) => {
    setSelectedBook(book)
    setCustomerView('book-detail')
  }

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return (
    <AppContext.Provider
      value={{
        userRole, userEmail, userName, login, logout,
        customerView, setCustomerView, adminPage, setAdminPage,
        isAdminView, setIsAdminView,
        books, categories, metrics, monthlyRevenue, yearlyRevenue,
        cart, favoriteIds, addToCart, removeFromCart, updateCartQuantity, toggleFavorite,
        openBook, selectedBook,
        addToast, toasts
      }}
    >
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium animate-in slide-in-from-right-full ${t.type === 'success' ? 'bg-green-500' : t.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
