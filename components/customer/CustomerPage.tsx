'use client'

import CustomerHeader from './CustomerHeader'
import BooksGrid from './BooksGrid'
import CartPage from './CartPage'
import FavoritesPage from './FavoritesPage'
import BookDetailPage from './BookDetailPage'
import SupportChat from '@/components/SupportChat'
import Footer from '@/components/Footer'
import { useApp } from '@/lib/store'

export default function CustomerPage() {
  const { customerView } = useApp()

  const renderView = () => {
    switch (customerView) {
      case 'cart': return <CartPage />
      case 'favorites': return <FavoritesPage />
      case 'book-detail': return <BookDetailPage />
      default: return <BooksGrid />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CustomerHeader />
      <main className="flex-1">
        {renderView()}
      </main>
      <SupportChat />
      <Footer />
    </div>
  )
}
