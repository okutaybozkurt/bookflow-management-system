/**
 * Backend uç noktalarına tipli erişim. Bileşenler `fetch` çağırmaz; yalnızca bu
 * fonksiyonları kullanır. API yanıtları burada arayüzün kullandığı tiplere çevrilir.
 */
import { api, tokenStore } from './api'
import type { AuthUser, Author, Book, Category, Order, OrderStatus } from './store/types'

// ---------- Ortak ----------

interface Paginated<T> {
  data: T[]
  meta: { current_page: number; last_page: number; total: number }
}

const PLACEHOLDER_COVER = 'https://placehold.co/400x600/e5e7eb/6b7280?text=Kapak'

/** Sayfalı bir listenin tüm sayfalarını çeker. */
async function fetchAllPages<T>(path: string, query: Record<string, string | number | boolean> = {}): Promise<T[]> {
  const items: T[] = []
  let page = 1
  let last = 1
  do {
    const res = await api<Paginated<T>>(path, { query: { ...query, per_page: 100, page } })
    items.push(...res.data)
    last = res.meta.last_page
    page++
  } while (page <= last)
  return items
}

// ---------- Auth ----------

interface ApiUser {
  id: number; name: string; email: string; role: 'customer' | 'admin'
  phone: string | null; address: string | null
  orders_count?: number; deleted_at?: string | null; created_at?: string
}

export const mapUser = (u: ApiUser): AuthUser => ({
  id: String(u.id), name: u.name, email: u.email, role: u.role, phone: u.phone, address: u.address,
})

export const authApi = {
  async login(email: string, password: string): Promise<AuthUser> {
    const res = await api<{ user: ApiUser; token: string }>('/auth/login', { method: 'POST', body: { email, password } })
    tokenStore.set(res.token)
    return mapUser(res.user)
  },
  async register(input: { name: string; email: string; password: string }): Promise<AuthUser> {
    const res = await api<{ user: ApiUser; token: string }>('/auth/register', { method: 'POST', body: input })
    tokenStore.set(res.token)
    return mapUser(res.user)
  },
  async logout(): Promise<void> {
    try {
      await api('/auth/logout', { method: 'POST' })
    } finally {
      tokenStore.clear()
    }
  },
  async me(): Promise<AuthUser> {
    return mapUser((await api<{ data: ApiUser }>('/me')).data)
  },
  async updateProfile(input: Partial<{ name: string; email: string; phone: string; address: string; current_password: string; password: string }>): Promise<AuthUser> {
    return mapUser((await api<{ data: ApiUser }>('/me', { method: 'PUT', body: input })).data)
  },
}

// ---------- Katalog ----------

interface ApiBook {
  id: number; title: string; isbn: string | null; price: number; stock: number
  cover_image: string | null; description: string | null; is_active: boolean
  author?: { id: number; name: string }; category?: { id: number; name: string }
  sold?: number; average_rating?: number | null; reviews_count?: number
}

export const mapBook = (b: ApiBook): Book => ({
  id: String(b.id),
  title: b.title,
  author: b.author?.name ?? '',
  authorId: String(b.author?.id ?? ''),
  price: b.price,
  stock: b.stock,
  sold: b.sold ?? 0,
  cover: b.cover_image || PLACEHOLDER_COVER,
  category: b.category?.name ?? '',
  categoryId: String(b.category?.id ?? ''),
  description: b.description ?? '',
  isbn: b.isbn ?? '',
  isActive: b.is_active,
  averageRating: b.average_rating ?? null,
  reviewsCount: b.reviews_count ?? 0,
})

export interface BookInput {
  title: string; price: string; stock: string; isbn: string; description: string
  author_id: string; category_id: string; cover?: File | null
}

/** Dosya yüklemesi olabileceği için FormData ile gönderilir (güncellemede `_method=PUT`). */
function bookFormData(input: BookInput, method?: 'PUT'): FormData {
  const fd = new FormData()
  fd.set('title', input.title)
  fd.set('price', input.price)
  fd.set('stock', input.stock)
  fd.set('author_id', input.author_id)
  fd.set('category_id', input.category_id)
  fd.set('isbn', input.isbn)
  fd.set('description', input.description)
  if (input.cover) fd.set('cover', input.cover)
  if (method) fd.set('_method', method)
  return fd
}

export const booksApi = {
  /** Müşteri vitrini: yalnızca aktif kitaplar. */
  async listPublic(): Promise<Book[]> {
    return (await fetchAllPages<ApiBook>('/books')).map(mapBook)
  },
  /** Yönetici listesi: pasif kitaplar dahil. */
  async listAdmin(): Promise<Book[]> {
    return (await fetchAllPages<ApiBook>('/admin/books')).map(mapBook)
  },
  async create(input: BookInput): Promise<Book> {
    return mapBook((await api<{ data: ApiBook }>('/admin/books', { method: 'POST', body: bookFormData(input) })).data)
  },
  async update(id: string, input: BookInput): Promise<Book> {
    return mapBook((await api<{ data: ApiBook }>(`/admin/books/${id}`, { method: 'POST', body: bookFormData(input, 'PUT') })).data)
  },
  remove: (id: string) => api<void>(`/admin/books/${id}`, { method: 'DELETE' }),
}

export const categoriesApi = {
  async list(): Promise<Category[]> {
    const res = await api<{ data: { id: number; name: string; books_count?: number }[] }>('/categories')
    return res.data.map((c) => ({ id: String(c.id), name: c.name, booksCount: c.books_count }))
  },
  async create(name: string): Promise<Category> {
    const res = await api<{ data: { id: number; name: string } }>('/admin/categories', { method: 'POST', body: { name } })
    return { id: String(res.data.id), name: res.data.name }
  },
}

export const authorsApi = {
  async list(): Promise<Author[]> {
    const res = await api<{ data: { id: number; name: string; books_count?: number }[] }>('/authors')
    return res.data.map((a) => ({ id: String(a.id), name: a.name, booksCount: a.books_count }))
  },
  async create(name: string): Promise<Author> {
    const res = await api<{ data: { id: number; name: string } }>('/admin/authors', { method: 'POST', body: { name } })
    return { id: String(res.data.id), name: res.data.name }
  },
}

// ---------- Favoriler ----------

export const favoritesApi = {
  async listIds(): Promise<string[]> {
    return (await api<{ data: { id: number }[] }>('/favorites')).data.map((b) => String(b.id))
  },
  add: (bookId: string) => api(`/favorites/${bookId}`, { method: 'POST' }),
  remove: (bookId: string) => api<void>(`/favorites/${bookId}`, { method: 'DELETE' }),
}

// ---------- Yorumlar ----------

export interface Review {
  id: number; rating: number; comment: string | null; created_at: string
  user?: { id: number; name: string }
}

export const reviewsApi = {
  async list(bookId: string): Promise<Review[]> {
    return (await api<{ data: Review[] }>(`/books/${bookId}/reviews`)).data
  },
  create: (bookId: string, input: { rating: number; comment?: string }) =>
    api(`/books/${bookId}/reviews`, { method: 'POST', body: input }),
  update: (id: number, input: { rating: number; comment?: string }) =>
    api(`/reviews/${id}`, { method: 'PUT', body: input }),
  remove: (id: number) => api<void>(`/reviews/${id}`, { method: 'DELETE' }),
}

// ---------- Siparişler ----------

interface ApiOrder {
  id: number; order_number: string; status: OrderStatus
  subtotal: number; shipping_fee: number; total: number; shipping_address: string; created_at: string
  customer?: { id: number; name: string; email: string }
  items?: { book_id: number; title: string | null; author: string | null; cover_image: string | null; quantity: number; unit_price: number }[]
}

export const mapOrder = (o: ApiOrder, fallbackName = ''): Order => ({
  dbId: String(o.id),
  id: o.order_number,
  date: new Date(o.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
  total: o.total,
  subtotal: o.subtotal,
  shippingFee: o.shipping_fee,
  shippingAddress: o.shipping_address,
  status: o.status,
  customerName: o.customer?.name ?? fallbackName,
  customerEmail: o.customer?.email ?? '',
  items: (o.items ?? []).map((i) => ({
    id: String(i.book_id),
    title: i.title ?? 'Silinmiş kitap',
    author: i.author ?? '',
    price: i.unit_price,
    quantity: i.quantity,
    cover: i.cover_image || PLACEHOLDER_COVER,
  })),
})

export const ordersApi = {
  async mine(customerName: string): Promise<Order[]> {
    return (await fetchAllPages<ApiOrder>('/orders')).map((o) => mapOrder(o, customerName))
  },
  async place(items: { book_id: string; quantity: number }[], shippingAddress: string, customerName: string): Promise<Order> {
    const res = await api<{ data: ApiOrder }>('/orders', {
      method: 'POST',
      body: { items: items.map((i) => ({ book_id: Number(i.book_id), quantity: i.quantity })), shipping_address: shippingAddress },
    })
    return mapOrder(res.data, customerName)
  },
  async cancel(dbId: string, customerName: string): Promise<Order> {
    return mapOrder((await api<{ data: ApiOrder }>(`/orders/${dbId}/cancel`, { method: 'POST' })).data, customerName)
  },
  // Yönetici
  async listAdmin(): Promise<Order[]> {
    return (await fetchAllPages<ApiOrder>('/admin/orders')).map((o) => mapOrder(o))
  },
  async updateStatus(dbId: string, status: OrderStatus): Promise<Order> {
    return mapOrder((await api<{ data: ApiOrder }>(`/admin/orders/${dbId}/status`, { method: 'PATCH', body: { status } })).data)
  },
}

// ---------- Kullanıcı yönetimi (yönetici) ----------

export interface ManagedUser extends AuthUser {
  ordersCount: number
  createdAt: string
}

const mapManagedUser = (u: ApiUser): ManagedUser => ({
  ...mapUser(u), ordersCount: u.orders_count ?? 0, createdAt: u.created_at ?? '',
})

export interface UserInput {
  name: string; email: string; role: 'customer' | 'admin'; password?: string; phone?: string; address?: string
}

export const usersApi = {
  async list(): Promise<ManagedUser[]> {
    return (await fetchAllPages<ApiUser>('/admin/users')).map(mapManagedUser)
  },
  async create(input: UserInput & { password: string }): Promise<ManagedUser> {
    return mapManagedUser((await api<{ data: ApiUser }>('/admin/users', { method: 'POST', body: input })).data)
  },
  async update(id: string, input: Partial<UserInput>): Promise<ManagedUser> {
    return mapManagedUser((await api<{ data: ApiUser }>(`/admin/users/${id}`, { method: 'PUT', body: input })).data)
  },
  remove: (id: string) => api<void>(`/admin/users/${id}`, { method: 'DELETE' }),
}

// ---------- Raporlar (yalnızca gelir ve satış) ----------

export interface ReportSummary {
  total_revenue: number; total_orders: number; pending_orders: number; books_sold: number
  total_books: number; total_stock: number; low_stock_count: number; customers: number
}
export interface SalesPoint { period: string; revenue: number; orders: number }
export interface TopBook { book_id: number; title: string; quantity_sold: number; revenue: number }
export interface CategorySale { category_id: number; name: string; quantity_sold: number; revenue: number }
export interface LowStockBook { id: number; title: string; stock: number }

export const reportsApi = {
  summary: async () => (await api<{ data: ReportSummary }>('/admin/reports/summary')).data,
  sales: async (period: 'monthly' | 'yearly', count?: number) =>
    (await api<{ data: SalesPoint[] }>('/admin/reports/sales', { query: { period, count } })).data,
  topBooks: async (limit = 10) => (await api<{ data: TopBook[] }>('/admin/reports/top-books', { query: { limit } })).data,
  categories: async () => (await api<{ data: CategorySale[] }>('/admin/reports/categories')).data,
  lowStock: async () => (await api<{ data: LowStockBook[] }>('/admin/reports/low-stock')).data,
}

// ---------- İşlem kayıtları & demo ----------

export interface ActivityLogEntry {
  id: number; action: string; description: string; subject_type: string | null
  ip_address: string | null; created_at: string
  user: { id: number; name: string; email: string } | null
}

export const logsApi = {
  async list(query: { action?: string; subject_type?: string; page?: number } = {}) {
    return api<Paginated<ActivityLogEntry>>('/admin/activity-logs', { query: { ...query, per_page: 20 } })
  },
}

export const demoApi = {
  reset: (mode: 'golden' | 'junk') => api('/admin/reset', { method: 'POST', body: { mode } }),
}
