'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  DataMode,
  Book,
  RevenueEntry,
  YearlyEntry,
  goldenBooks,
  goldenMonthlyRevenue,
  goldenYearlyRevenue,
  goldenMetrics,
  junkBooks,
  junkMonthlyRevenue,
  junkYearlyRevenue,
  junkMetrics,
} from './data'

export type UserRole = 'guest' | 'customer' | 'admin'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

export type CustomerView = 'home' | 'cart' | 'favorites' | 'book-detail'

export interface CartItem {
  book: Book
  quantity: number
}

interface AppState {
  // Auth
  userRole: UserRole
  userEmail: string
  userName: string
  login: (role: UserRole, email: string, name?: string) => void
  logout: () => void

  // Data Mode
  dataMode: DataMode
  setDataMode: (mode: DataMode) => void

  // Derived data
  books: Book[]
  monthlyRevenue: RevenueEntry[]
  yearlyRevenue: YearlyEntry[]
  metrics: { toplamKitap: number; toplamGelir: number; toplamStok: number }

  // Customer navigation
  customerView: CustomerView
  setCustomerView: (view: CustomerView) => void
  selectedBook: Book | null
  openBook: (book: Book) => void

  // Cart
  cartItems: CartItem[]
  cartCount: number
  addToCart: (book: Book) => void
  removeFromCart: (bookId: string) => void
  updateCartQty: (bookId: string, qty: number) => void

  // Favorites
  favoriteIds: Set<string>
  toggleFavorite: (bookId: string) => void

  // Admin view
  adminPage: string
  setAdminPage: (page: string) => void

  // Toast notifications
  toasts: Toast[]
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('guest')
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [dataMode, setDataMode] = useState<DataMode>('golden')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(['2', '6']))
  const [adminPage, setAdminPage] = useState('dashboard')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [customerView, setCustomerView] = useState<CustomerView>('home')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const login = (role: UserRole, email: string, name?: string) => {
    setUserRole(role)
    setUserEmail(email)
    setUserName(name || email.split('@')[0])
  }

  const logout = () => {
    setUserRole('guest')
    setUserEmail('')
    setUserName('')
    setAdminPage('dashboard')
    setCustomerView('home')
  }

  const openBook = (book: Book) => {
    setSelectedBook(book)
    setCustomerView('book-detail')
  }

  const addToCart = (book: Book) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.book.id === book.id)
      if (existing) {
        return prev.map((i) => i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { book, quantity: 1 }]
    })
  }

  const removeFromCart = (bookId: string) => {
    setCartItems((prev) => prev.filter((i) => i.book.id !== bookId))
  }

  const updateCartQty = (bookId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(bookId)
      return
    }
    setCartItems((prev) => prev.map((i) => i.book.id === bookId ? { ...i, quantity: qty } : i))
  }

  const toggleFavorite = (bookId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(bookId)) next.delete(bookId)
      else next.add(bookId)
      return next
    })
  }

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration: 3000 }])
    setTimeout(() => removeToast(id), 3000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const isGolden = dataMode === 'golden'
  const allBooks = isGolden ? goldenBooks : junkBooks
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <AppContext.Provider
      value={{
        userRole,
        userEmail,
        userName,
        login,
        logout,
        dataMode,
        setDataMode,
        books: allBooks,
        monthlyRevenue: isGolden ? goldenMonthlyRevenue : junkMonthlyRevenue,
        yearlyRevenue: isGolden ? goldenYearlyRevenue : junkYearlyRevenue,
        metrics: isGolden ? goldenMetrics : junkMetrics,
        customerView,
        setCustomerView,
        selectedBook,
        openBook,
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartQty,
        favoriteIds,
        toggleFavorite,
        adminPage,
        setAdminPage,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
