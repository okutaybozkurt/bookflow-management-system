'use client'

import { useState, useEffect } from 'react'
import { AppProvider, useApp } from '@/lib/store'
import CustomerPage from '@/components/customer/CustomerPage'
import AdminLayout from '@/components/admin/AdminLayout'
import ToastContainer from '@/components/ToastContainer'

import AdminResetHandler from '@/components/AdminResetHandler'
import SupportChat from '@/components/SupportChat'

function AppRouter() {
  const { userRole, isAdminView } = useApp()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (userRole === 'admin' && isAdminView) {
    return (
      <>
        <AdminLayout />
        <ToastContainer />
      </>
    )
  }

  return (
    <>
      <CustomerPage />
      <ToastContainer />
      {!isAdminView && <SupportChat />}
    </>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <AdminResetHandler />
      <AppRouter />
    </AppProvider>
  )
}
