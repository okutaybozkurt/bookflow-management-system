'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { UserRole, CustomerView, AdminPage, Book, Category, CartItem, Order, Toast } from './store/types'
import { useAuth } from './store/hooks/useAuth'
import { useData } from './store/hooks/useData'
import { useCart } from './store/hooks/useCart'

interface AppContextType {
  // Auth
  userRole: UserRole
  userEmail: string
  userName: string
  userId: string
  login: (role: UserRole, email: string, name?: string, id?: string) => void
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
  setOrders: (orders: Order[]) => void
  createOrder: () => void

  // UI
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
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
  const data = useData()
  const cart = useCart(
    auth.userRole, 
    auth.userName, 
    auth.userEmail, 
    auth.userId,
    addToast, 
    setAuthModalOpen, 
    data.setBooks, 
    setCustomerView
  )

  // --- Auth Wrapper with Redirect Logic ---
  const login = (role: UserRole, email: string, name?: string, id?: string) => {
    auth.login(role, email, name, id, () => {
      if (role !== 'admin' && cart.cartItems.length > 0) {
        setCustomerView('cart')
      }
    })
  }

  const openBook = (book: Book) => {
    data.setSelectedBook(book)
    setCustomerView('book-detail')
  }

  const logout = () => {
    auth.logout()
    setCustomerView('home')
  }

  return (
    <AppContext.Provider
      value={{
        ...auth,
        ...data,
        ...cart,
        login,
        logout,
        customerView, setCustomerView, adminPage, setAdminPage,
        isAuthModalOpen, setAuthModalOpen,
        toasts, addToast, removeToast,
        openBook,
      }}
    >
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium animate-in slide-in-from-right-full ${
              t.type === 'success' ? 'bg-green-500' : t.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
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
