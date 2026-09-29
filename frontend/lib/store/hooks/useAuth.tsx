import { useCallback, useEffect, useState } from 'react'
import { UNAUTHORIZED_EVENT, tokenStore } from '../../api'
import { authApi } from '../../services'
import type { AuthUser, UserRole } from '../types'

const ADMIN_VIEW_KEY = 'bookflow_admin_view'

/**
 * Oturum yönetimi. Kimlik ve rol yalnızca backend'den (/me) gelir; tarayıcıda
 * sadece token saklanır, bu yüzden rol localStorage'dan değiştirilerek yükseltilemez.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [isAdminView, setIsAdminViewState] = useState(false)

  const setIsAdminView = useCallback((value: boolean) => {
    setIsAdminViewState(value)
    try { localStorage.setItem(ADMIN_VIEW_KEY, String(value)) } catch { /* yoksay */ }
  }, [])

  // Sayfa yenilenince token varsa oturumu backend'den geri yükle.
  useEffect(() => {
    if (!tokenStore.get()) {
      setAuthReady(true)
      return
    }
    authApi.me()
      .then((me) => {
        setUser(me)
        let saved = false
        try { saved = localStorage.getItem(ADMIN_VIEW_KEY) === 'true' } catch { /* yoksay */ }
        setIsAdminViewState(me.role === 'admin' && saved)
      })
      .catch(() => tokenStore.clear())
      .finally(() => setAuthReady(true))
  }, [])

  // Token süresi dolduğunda / iptal edildiğinde API istemcisi bu olayı yollar.
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null)
      setIsAdminViewState(false)
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  const startSession = (me: AuthUser) => {
    setUser(me)
    setIsAdminView(me.role === 'admin')
    return me
  }

  const signIn = async (email: string, password: string) => startSession(await authApi.login(email, password))

  const signUp = async (input: { name: string; email: string; password: string }) =>
    startSession(await authApi.register(input))

  const signOut = async () => {
    try {
      await authApi.logout()
    } catch { /* token zaten geçersiz olabilir; yerel oturum yine de kapanır */ }
    setUser(null)
    setIsAdminView(false)
  }

  const updateProfile = async (input: Parameters<typeof authApi.updateProfile>[0]) => {
    const me = await authApi.updateProfile(input)
    setUser(me)
    return me
  }

  const userRole: UserRole = user?.role ?? 'guest'

  return {
    user, authReady, userRole,
    userId: user?.id ?? '',
    userName: user?.name ?? '',
    userEmail: user?.email ?? '',
    userPhone: user?.phone ?? '',
    userAddress: user?.address ?? '',
    isAdminView, setIsAdminView,
    signIn, signUp, signOut, updateProfile,
  }
}
