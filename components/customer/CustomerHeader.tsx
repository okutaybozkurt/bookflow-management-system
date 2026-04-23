'use client'

import { ShoppingCart, Heart, User, LogOut, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'
import AuthModal from '@/components/AuthModal'
import { useState } from 'react'
import AdvancedSearch from './AdvancedSearch'

export default function CustomerHeader() {
  const { userRole, logout, cartCount, favoriteIds, userName, setCustomerView } = useApp()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const isLoggedIn = userRole === 'customer' || userRole === 'admin'

  return (
    <>
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Kitap<span className="text-primary">Üssü</span>
              </span>
            </div>

            {/* Search Bar */}
            <AdvancedSearch />

            {/* Right: Auth / Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {!isLoggedIn ? (
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-5 py-2 rounded-md"
                >
                  Giriş Yap
                </Button>
              ) : (
                <div className="flex items-center gap-1">
                  <button className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-md hover:bg-muted transition-colors group">
                    <User className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    <span className="text-[10px] text-muted-foreground group-hover:text-primary line-clamp-1">
                      {userName}
                    </span>
                  </button>
                  <button
                    onClick={() => setCustomerView('favorites')}
                    className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-md hover:bg-muted transition-colors group"
                  >
                    <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    {favoriteIds.size > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {favoriteIds.size}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground group-hover:text-primary">Favoriler</span>
                  </button>
                  <button
                    onClick={() => setCustomerView('cart')}
                    className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-md hover:bg-muted transition-colors group"
                  >
                    <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground group-hover:text-primary">Sepetim</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-md hover:bg-muted transition-colors group"
                  >
                    <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive" />
                    <span className="text-[10px] text-muted-foreground group-hover:text-destructive">Çıkış</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}
