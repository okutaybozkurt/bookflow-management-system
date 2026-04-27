import { useState } from 'react'
import { Book, CartItem, Order, UserRole } from '../types'

export function useCart(userRole: UserRole, userName: string, userEmail: string, addToast: any, setAuthModalOpen: any, setBooks: any, setCustomerView: any) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [orders, setOrders] = useState<Order[]>([])

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

  const createOrder = () => {
    if (userRole === 'guest') {
      addToast('Siparişi tamamlamak için lütfen giriş yapın.', 'info')
      setAuthModalOpen(true)
      return
    }

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

    setBooks((prev: Book[]) => prev.map(book => {
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

  return {
    cartItems, setCartItems, favoriteIds, setFavoriteIds, orders, setOrders,
    addToCart, removeFromCart, updateCartQty, toggleFavorite, createOrder
  }
}
