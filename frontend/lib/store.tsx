'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { UserRole, CustomerView, AdminPage, AuthUser, Author, Book, Category, CartItem, Order, Toast } from './store/types'
import { UNAUTHORIZED_EVENT } from './api'
import { authApi } from './services'
import { useAuth } from './store/hooks/useAuth'
import { useData } from './store/hooks/useData'
import { useCart } from './store/hooks/useCart'

interface AppContextType {
  // Auth
  userRole: UserRole
  userId: string
  userEmail: string
  userName: string
  userPhone: string
  userAddress: string
  authReady: boolean
  signIn: (email: string, password: string) => Promise<AuthUser>
  signUp: (input: { name: string; email: string; password: string }) => Promise<AuthUser>
  logout: () => Promise<void>
  updateProfile: (input: Parameters<typeof authApi.updateProfile>[0]) => Promise<AuthUser>

  // Navigation
  customerView: CustomerView
  setCustomerView: (view: CustomerView) => void
  adminPage: AdminPage
  setAdminPage: (page: AdminPage) => void
  isAdminView: boolean
  setIsAdminView: (v: boolean) => void

  // Katalog (vitrin: yalnızca aktif kitaplar; adminBooks: yönetici için tümü)
  books: Book[]
  adminBooks: Book[]
  categories: Category[]
  authors: Author[]
  catalogLoading: boolean
  catalogError: string | null
  refreshCatalog: () => Promise<void>
  selectedBook: Book | null
  openBook: (book: Book) => void

  // Sepet, favori, sipariş
  cartItems: CartItem[]
  favoriteIds: Set<string>
  orders: Order[]
  addToCart: (book: Book) => void
  removeFromCart: (bookId: string) => void
  updateCartQty: (bookId: string, quantity: number) => void
  toggleFavorite: (bookId: string) => void
  createOrder: (shippingAddress: string) => Promise<void>
  cancelOrder: (order: Order) => Promise<void>

  // UI
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
  toasts: Toast[]
  isAuthModalOpen: boolean
  setAuthModalOpen: (open: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  // --- UI State ---
  const [customerView, setCustomerView] = useState<CustomerView>('home')
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard')
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  // --- UI Handlers ---
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // --- Domain Hooks (SOLID: SRP) ---
  const auth = useAuth()
  const data = useData(auth.userRole, auth.authReady)
  const cart = useCart(auth.user, addToast, setAuthModalOpen, data.refreshCatalog, setCustomerView)

  // Oturum düşerse (token süresi doldu) kullanıcı bilgilendirilir.
  useEffect(() => {
    const onUnauthorized = () => {
      addToast('Oturumunuz sona erdi, lütfen tekrar giriş yapın.', 'info')
      setCustomerView('home')
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [addToast])

  // Giriş sonrası sepet doluysa doğrudan sepete yönlendir.
  const signIn = async (email: string, password: string) => {
    const me = await auth.signIn(email, password)
    if (me.role !== 'admin' && cart.cartItems.length > 0) setCustomerView('cart')
    return me
  }

  const openBook = (book: Book) => {
    data.setSelectedBook(book)
    setCustomerView('book-detail')
  }

  const logout = async () => {
    await auth.signOut()
    setCustomerView('home')
  }

  return (
    <AppContext.Provider
      value={{
        userRole: auth.userRole, userId: auth.userId, userEmail: auth.userEmail, userName: auth.userName,
        userPhone: auth.userPhone, userAddress: auth.userAddress, authReady: auth.authReady,
        signIn, signUp: auth.signUp, logout, updateProfile: auth.updateProfile,
        isAdminView: auth.isAdminView, setIsAdminView: auth.setIsAdminView,
        ...data,
        ...cart,
        customerView, setCustomerView, adminPage, setAdminPage,
        isAuthModalOpen, setAuthModalOpen,
        toasts, addToast, removeToast,
        openBook,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
