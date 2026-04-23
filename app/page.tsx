'use client'

import { AppProvider, useApp } from '@/lib/store'
import CustomerPage from '@/components/customer/CustomerPage'
import AdminLayout from '@/components/admin/AdminLayout'
import ToastContainer from '@/components/ToastContainer'

function AppRouter() {
  const { userRole } = useApp()

  if (userRole === 'admin') {
    return <AdminLayout />
  }

  return <CustomerPage />
}

export default function Home() {
  return (
    <AppProvider>
      <AppRouter />
      <ToastContainer />
    </AppProvider>
  )
}
