import { useCallback, useEffect, useState } from 'react'
import { errorMessage } from '../../api'
import { favoritesApi, ordersApi } from '../../services'
import type { AuthUser, Book, CartItem, CustomerView, Order } from '../types'

const CART_KEY = 'bookflow_cart'

type AddToast = (message: string, type: 'success' | 'error' | 'info') => void

/** Sepet (tarayıcıda), favoriler ve siparişler (backend'de) yönetimi. */
export function useCart(
  user: AuthUser | null,
  addToast: AddToast,
  setAuthModalOpen: (open: boolean) => void,
  refreshCatalog: () => Promise<void>,
  setCustomerView: (view: CustomerView) => void,
) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartLoaded, setCartLoaded] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [orders, setOrders] = useState<Order[]>([])

  // Sepet tarayıcıda saklanır (giriş yapmadan da alışveriş sepeti dolabilir).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      if (saved) setCartItems(JSON.parse(saved))
    } catch { /* bozuk veri yoksayılır */ }
    setCartLoaded(true)
  }, [])

  useEffect(() => {
    if (!cartLoaded) return
    try { localStorage.setItem(CART_KEY, JSON.stringify(cartItems)) } catch { /* yoksay */ }
  }, [cartItems, cartLoaded])

  // Favoriler ve siparişler kullanıcıya bağlıdır; giriş/çıkışta yeniden yüklenir.
  const userId = user?.id
  const userName = user?.name ?? ''
  const isCustomer = user?.role === 'customer'

  useEffect(() => {
    if (!userId) {
      setFavoriteIds(new Set())
      setOrders([])
      return
    }
    favoritesApi.listIds().then((ids) => setFavoriteIds(new Set(ids))).catch(() => {})
    if (isCustomer) ordersApi.mine(userName).then(setOrders).catch(() => {})
  }, [userId, userName, isCustomer])

  const addToCart = (book: Book) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === book.id)
      if (existing) {
        return prev.map((item) => (item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...book, quantity: 1 }]
    })
  }

  const removeFromCart = (bookId: string) => setCartItems((prev) => prev.filter((item) => item.id !== bookId))

  const updateCartQty = (bookId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(bookId)
    setCartItems((prev) => prev.map((item) => (item.id === bookId ? { ...item, quantity } : item)))
  }

  const toggleFavorite = useCallback(async (bookId: string) => {
    if (!user) {
      addToast('Favorilere eklemek için giriş yapın.', 'info')
      setAuthModalOpen(true)
      return
    }

    const wasFavorite = favoriteIds.has(bookId)
    const apply = (add: boolean) =>
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        add ? next.add(bookId) : next.delete(bookId)
        return next
      })

    apply(!wasFavorite) // anında geri bildirim; hata olursa geri alınır
    try {
      await (wasFavorite ? favoritesApi.remove(bookId) : favoritesApi.add(bookId))
    } catch (error) {
      apply(wasFavorite)
      addToast(errorMessage(error, 'Favori güncellenemedi.'), 'error')
    }
  }, [user, favoriteIds, addToast, setAuthModalOpen])

  const createOrder = async (shippingAddress: string) => {
    if (!user) {
      addToast('Siparişi tamamlamak için lütfen giriş yapın.', 'info')
      setAuthModalOpen(true)
      return
    }
    if (cartItems.length === 0) return

    try {
      const order = await ordersApi.place(
        cartItems.map((i) => ({ book_id: i.id, quantity: i.quantity })),
        shippingAddress,
        user.name,
      )
      setOrders((prev) => [order, ...prev])
      setCartItems([])
      await refreshCatalog() // stok değişti
      addToast('Siparişiniz başarıyla oluşturuldu! 🎉', 'success')
      setCustomerView('profile')
    } catch (error) {
      addToast(errorMessage(error, 'Sipariş oluşturulamadı.'), 'error')
      await refreshCatalog() // stok bilgisi eskimiş olabilir
    }
  }

  const cancelOrder = async (order: Order) => {
    try {
      const updated = await ordersApi.cancel(order.dbId, user?.name ?? '')
      setOrders((prev) => prev.map((o) => (o.dbId === updated.dbId ? updated : o)))
      await refreshCatalog() // iptalde stok iade edilir
      addToast('Sipariş iptal edildi.', 'success')
    } catch (error) {
      addToast(errorMessage(error, 'Sipariş iptal edilemedi.'), 'error')
    }
  }

  return {
    cartItems, favoriteIds, orders,
    addToCart, removeFromCart, updateCartQty, toggleFavorite, createOrder, cancelOrder,
  }
}
