export type UserRole = 'guest' | 'customer' | 'admin'
export type CustomerView = 'home' | 'categories' | 'cart' | 'favorites' | 'profile' | 'book-detail'
export type AdminPage = 'dashboard' | 'kitap-yonetimi' | 'kullanici-yonetimi' | 'siparisler' | 'raporlar' | 'gelir-gider' | 'ayarlar'

export interface Book {
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

export interface Category {
  id: string
  name: string
}

export interface CartItem extends Book {
  quantity: number
}

export interface Order {
  id: string
  date: string
  total: number
  items: CartItem[]
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  customerName: string
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
