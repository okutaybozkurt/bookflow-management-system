/**
 * Laravel REST API istemcisi.
 * Token yönetimi, JSON/FormData gönderimi ve hataların tek biçime çevrilmesi burada yapılır.
 */

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')

const TOKEN_KEY = 'bookflow_token'
export const UNAUTHORIZED_EVENT = 'bookflow:unauthorized'

export const tokenStore = {
  get(): string | null {
    try { return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY) } catch { return null }
  },
  set(token: string) {
    try { localStorage.setItem(TOKEN_KEY, token) } catch { /* özel pencere vb. */ }
  },
  clear() {
    try { localStorage.removeItem(TOKEN_KEY) } catch { /* yoksay */ }
  },
}

/** API'den dönen hata: HTTP durumu, kullanıcıya gösterilecek mesaj ve alan bazlı hatalar. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: Record<string, string[]> = {},
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Herhangi bir hatadan kullanıcıya gösterilecek metni çıkarır. */
export function errorMessage(error: unknown, fallback = 'Bir hata oluştu.'): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}

type Query = Record<string, string | number | boolean | undefined | null>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Query
}

function buildUrl(path: string, query?: Query) {
  const url = new URL(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`)
  Object.entries(query ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
  })
  return url.toString()
}

export async function api<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query } = options
  const token = tokenStore.get()

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let payload: BodyInit | undefined
  if (body instanceof FormData) {
    payload = body // Content-Type'ı tarayıcı (boundary ile) kendisi ekler
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res: Response
  try {
    res = await fetch(buildUrl(path, query), { method, headers, body: payload })
  } catch {
    throw new ApiError(0, 'Sunucuya ulaşılamadı. Backend (Laravel) çalışıyor mu?')
  }

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    // Oturum düştüyse (token süresi doldu / iptal edildi) uygulamayı bilgilendir.
    // Giriş denemesindeki 401 (hatalı şifre) oturum düşmesi değildir.
    if (res.status === 401 && token && !path.startsWith('/auth/login')) {
      tokenStore.clear()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }

    const errors: Record<string, string[]> = data?.errors ?? {}
    const first = Object.values(errors)[0]?.[0]
    throw new ApiError(res.status, first || data?.message || 'İşlem başarısız.', errors)
  }

  return data as T
}
