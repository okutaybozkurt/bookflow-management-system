import { useState, useEffect } from 'react'
import { Book, CartItem, Order, UserRole } from '../types'

export function useCart(
  userRole: UserRole, 
  userName: string, 
  userEmail: string, 
  userId: string,
  addToast: any, 
  setAuthModalOpen: any, 
  setBooks: any, 
  setCustomerView: any
) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [orders, setOrders] = useState<Order[]>([])

  // Fetch orders from API
  useEffect(() => {
    if (userId) {
      fetch(`/api/orders?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Map the API data format to the local Order format
            const mappedOrders = data.map((o: any) => ({
              id: o.id.substring(0, 8).toUpperCase(), // Shorten UUID for display
              date: new Date(o.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
              total: o.total,
              status: o.status,
              customerName: userName,
              items: o.items.map((i: any) => ({
                id: i.bookId,
                title: i.book.title,
                author: i.book.author?.name || 'Bilinmeyen Yazar',
                price: i.price,
                quantity: i.quantity,
                cover: i.book.coverImage || 'https://placehold.co/400x600/gray/white?text=No+Cover'
              }))
            }));
            setOrders(mappedOrders);
          }
        })
        .catch(err => console.error('Error fetching orders:', err));
    } else {
      setOrders([]);
    }
  }, [userId, userName]);

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

  const createOrder = async () => {
    if (userRole === 'guest') {
      addToast('Siparişi tamamlamak için lütfen giriş yapın.', 'info')
      setAuthModalOpen(true)
      return
    }

    if (cartItems.length === 0) return

    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = subtotal > 500 ? 0 : 29.90
    const total = subtotal + shipping

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          total,
          items: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      if (!res.ok) throw new Error('Sipariş oluşturulamadı');

      const createdOrder = await res.json();
      
      const newOrder = {
        id: createdOrder.id.substring(0, 8).toUpperCase(),
        date: new Date(createdOrder.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
        total: createdOrder.total,
        status: createdOrder.status,
        customerName: userName,
        items: createdOrder.items.map((i: any) => ({
          id: i.bookId,
          title: i.book.title,
          author: i.book.author?.name || 'Bilinmeyen Yazar',
          price: i.price,
          quantity: i.quantity,
          cover: i.book.coverImage || 'https://placehold.co/400x600/gray/white?text=No+Cover'
        }))
      };

      setOrders(prev => [newOrder, ...prev]);

      setBooks((prev: Book[]) => prev.map(book => {
        const cartItem = cartItems.find(item => item.id === book.id)
        if (cartItem) {
          return { ...book, stock: book.stock - cartItem.quantity, sold: book.sold + cartItem.quantity }
        }
        return book
      }))

      setCartItems([])
      addToast('Siparişiniz başarıyla oluşturuldu! 🎉', 'success')
      setCustomerView('profile')
    } catch (error) {
      console.error(error);
      addToast('Sipariş oluşturulurken bir hata oluştu.', 'error');
    }
  }

  return {
    cartItems, setCartItems, favoriteIds, setFavoriteIds, orders, setOrders,
    addToCart, removeFromCart, updateCartQty, toggleFavorite, createOrder
  }
}
