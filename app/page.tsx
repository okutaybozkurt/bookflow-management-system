'use client'

import { AppProvider, useApp } from '@/lib/store'
import CustomerPage from '@/components/customer/CustomerPage'
import AdminLayout from '@/components/admin/AdminLayout'
import ToastContainer from '@/components/ToastContainer'

import AdminResetHandler from '@/components/AdminResetHandler'

function AppRouter() {
  const { userRole, isAdminView } = useApp()

  if (userRole === 'admin' && isAdminView) {
    return <AdminLayout />
  }

  return <CustomerPage />
}

export default function Home() {
  return (
    <AppProvider>
      <AdminResetHandler />
      <AppRouter />
      <ToastContainer />
    </AppProvider>
  )
}
