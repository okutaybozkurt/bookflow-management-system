'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type UserRole = 'guest' | 'customer' | 'admin'
export type CustomerView = 'home' | 'categories' | 'cart' | 'favorites' | 'profile' | 'book-detail'
export type AdminPage = 'dashboard' | 'kitap-yonetimi' | 'kullanici-yonetimi' | 'siparisler' | 'raporlar' | 'gelir-gider' | 'ayarlar'

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
  pages?: number
  language?: string
  publishDate?: string
}

interface Category {
  id: string
  name: string
}

interface CartItem extends Book {
  quantity: number
}

interface Order {
  id: string
  date: string
  total: number
  items: CartItem[]
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  customerName: string
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
  cartItems: CartItem[]
  favoriteIds: Set<string>
  addToCart: (book: Book) => void
  removeFromCart: (bookId: string) => void
  updateCartQty: (bookId: string, quantity: number) => void
  toggleFavorite: (bookId: string) => void
  removeToast: (id: string) => void
  openBook: (book: Book) => void
  selectedBook: Book | null

  orders: Order[]
  createOrder: () => void

  // UI
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[]
  isAuthModalOpen: boolean
  setAuthModalOpen: (open: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('guest')
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [isAdminView, setIsAdminView] = useState(false)

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([])
  const [customerView, setCustomerView] = useState<CustomerView>('home')
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)

  const metrics = {
    toplamKitap: books.length,
    toplamGelir: books.reduce((acc, b) => acc + (b.price * b.sold), 0),
    toplamStok: books.reduce((acc, b) => acc + b.stock, 0),
  }

  const [monthlyRevenue, setMonthlyRevenue] = useState([
    { month: 'Oca', gelir: 4500, gider: 2100 },
    { month: 'Şub', gelir: 5200, gider: 2800 },
    { month: 'Mar', gelir: 4800, gider: 2400 },
    { month: 'Nis', gelir: 6100, gider: 3100 },
  ])
  const [yearlyRevenue, setYearlyRevenue] = useState([
    { year: '2023', gelir: 45000, gider: 22000 },
    { year: '2024', gelir: 52000, gider: 28000 },
  ])

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
        if (booksRes.ok) {
          const booksData = await booksRes.json()
          setBooks(booksData)
          
          // Detect mode based on data
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
    setCustomerView('home')
  }

  const createOrder = () => {
    if (cartItems.length === 0) return

    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = subtotal > 500 ? 0 : 29.90
    const total = subtotal + shipping

    const newOrder: Order = {
      id: `#BF-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
      total,
      items: [...cartItems],
      status: 'pending',
      customerName: userName || userEmail.split('@')[0] || 'Misafir Müşteri'
    }

    // Update stock and orders
    setBooks(prev => prev.map(book => {
      const cartItem = cartItems.find(item => item.id === book.id)
      if (cartItem) {
        return { ...book, stock: book.stock - cartItem.quantity, sold: book.sold + cartItem.quantity }
      }
      return book
    }))

    setOrders(prev => [newOrder, ...prev])
    setCartItems([])
    addToast('Siparişiniz başarıyla oluşturuldu! 🎉', 'success')
    setCustomerView('profile')
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const addToCart = (book: Book) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === book.id)
      if (existing) {
        return prev.map((item) => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...book, quantity: 1 }]
    })
  }

  const removeFromCart = (bookId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== bookId))
  }

  const updateCartQty = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId)
      return
    }
    setCartItems((prev) => prev.map((item) => item.id === bookId ? { ...item, quantity } : item))
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
        cartItems, favoriteIds, addToCart, removeFromCart, updateCartQty, toggleFavorite,
        removeToast, orders, createOrder,
        openBook, selectedBook,
        addToast, toasts,
        isAuthModalOpen, setAuthModalOpen
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
