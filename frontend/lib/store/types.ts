export type UserRole = 'guest' | 'customer' | 'admin'
export type CustomerView = 'home' | 'categories' | 'cart' | 'favorites' | 'profile' | 'book-detail'
export type AdminPage =
  | 'dashboard' | 'kitap-yonetimi' | 'kategori-yazar' | 'kullanici-yonetimi' | 'siparisler'
  | 'raporlar' | 'gelir' | 'islem-kayitlari' | 'ayarlar'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone: string | null
  address: string | null
}

export interface Book {
  id: string
  title: string
  author: string
  authorId: string
  price: number
  stock: number
  sold: number
  cover: string
  category: string
  categoryId: string
  description: string
  isbn?: string
  isActive: boolean
  averageRating: number | null
  reviewsCount: number
}

export interface Category {
  id: string
  name: string
  booksCount?: number
}

export interface Author {
  id: string
  name: string
  booksCount?: number
}

export interface CartItem extends Book {
  quantity: number
}

export interface OrderLine {
  id: string
  title: string
  author: string
  price: number
  quantity: number
  cover: string
}

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  /** Veritabanı kimliği (API çağrıları için) */
  dbId: string
  /** Kullanıcıya gösterilen sipariş numarası */
  id: string
  date: string
  total: number
  subtotal: number
  shippingFee: number
  shippingAddress: string
  items: OrderLine[]
  status: OrderStatus
  customerName: string
  customerEmail: string
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
