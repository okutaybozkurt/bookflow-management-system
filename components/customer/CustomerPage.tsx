'use client'

import CustomerHeader from './CustomerHeader'
import BooksGrid from './BooksGrid'
import CartPage from './CartPage'
import FavoritesPage from './FavoritesPage'
import BookDetailPage from './BookDetailPage'
import ProfilePage from './ProfilePage'
import SupportChat from '@/components/SupportChat'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import { useApp } from '@/lib/store'

export default function CustomerPage() {
  const { customerView, isAuthModalOpen, setAuthModalOpen } = useApp()

  const renderView = () => {
    switch (customerView) {
      case 'cart': return <CartPage />
      case 'favorites': return <FavoritesPage />
      case 'book-detail': return <BookDetailPage />
      case 'profile': return <ProfilePage />
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
      
      {/* Root level Auth Modal to prevent z-index issues */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  )
}
