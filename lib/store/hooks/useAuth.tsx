import { useState, useEffect } from 'react'
import { UserRole } from '../types'

export function useAuth() {
  const [userRole, setUserRole] = useState<UserRole>('guest')
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [isAdminView, setIsAdminView] = useState(false)

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole
    const savedEmail = localStorage.getItem('userEmail')
    const savedName = localStorage.getItem('userName')
    const savedIsAdminView = localStorage.getItem('isAdminView') === 'true'

    if (savedRole) setUserRole(savedRole)
    if (savedEmail) setUserEmail(savedEmail)
    if (savedName) setUserName(savedName)
    if (savedRole === 'admin') setIsAdminView(savedIsAdminView)
  }, [])

  useEffect(() => {
    if (userRole !== 'guest') {
      localStorage.setItem('userRole', userRole)
      localStorage.setItem('userEmail', userEmail)
      localStorage.setItem('userName', userName)
      localStorage.setItem('isAdminView', isAdminView.toString())
    } else {
      localStorage.removeItem('userRole')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      localStorage.removeItem('isAdminView')
    }
  }, [userRole, userEmail, userName, isAdminView])

  const login = (role: UserRole, email: string, name?: string, onLogin?: () => void) => {
    setUserRole(role)
    setUserEmail(email)
    setUserName(name || email.split('@')[0])
    if (role === 'admin') setIsAdminView(true)
    if (onLogin) onLogin()
  }

  const logout = () => {
    setUserRole('guest')
    setUserEmail('')
    setUserName('')
    setIsAdminView(false)
  }

  return {
    userRole, userEmail, userName, isAdminView,
    setUserRole, setUserEmail, setUserName, setIsAdminView,
    login, logout
  }
}
