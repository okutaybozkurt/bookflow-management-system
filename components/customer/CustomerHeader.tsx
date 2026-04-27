'use client'

import { ShoppingCart as CartIcon, Heart as HeartIcon, User as UserIcon, LogOut as LogOutIcon, BookOpen as BookOpenIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/store'
import { useState } from 'react'
import AdvancedSearch from './AdvancedSearch'

export default function CustomerHeader() {
  const { userRole, logout, cartItems, favoriteIds, userName, setCustomerView, setIsAdminView, setAuthModalOpen } = useApp()

  const isLoggedIn = userRole === 'customer' || userRole === 'admin'
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => setCustomerView('home')} className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <BookOpenIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Kitap<span className="text-primary">Üssü</span>
          </span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl hidden md:block">
          <AdvancedSearch />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart (Always Visible) */}
          <button 
            onClick={() => setCustomerView('cart')}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-md hover:bg-muted transition-colors relative group"
          >
            <CartIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-3 w-3.5 h-3.5 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground group-hover:text-primary">Sepetim</span>
          </button>

          {!isLoggedIn ? (
            <Button onClick={() => setAuthModalOpen(true)} className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20 h-10">
              Giriş Yap
            </Button>
          ) : (
            <div className="flex items-center gap-1">
              {/* Admin Panel Button (Only for Admins) */}
              {userRole === 'admin' && (
                <button
                  onClick={() => setIsAdminView(true)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors group"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-[10px] font-bold">ADM</span>
                  </div>
                  <span className="text-[10px] font-bold">Admin Panel</span>
                </button>
              )}

              {/* Profile */}
              <button 
                onClick={() => setCustomerView('profile')}
                className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-md hover:bg-muted transition-colors group"
              >
                <UserIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                <span className="text-[10px] text-muted-foreground group-hover:text-primary line-clamp-1">{userName}</span>
              </button>

              {/* Favorites (Only if logged in) */}
              {userRole !== 'admin' && (
                <>
                  <button 
                    onClick={() => setCustomerView('favorites')}
                    className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-md hover:bg-muted transition-colors relative group"
                  >
                    <HeartIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    {favoriteIds.size > 0 && (
                      <span className="absolute top-1 right-3 w-3.5 h-3.5 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                        {favoriteIds.size}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground group-hover:text-primary">Favoriler</span>
                  </button>

                  <button 
                    onClick={logout}
                    className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-md hover:bg-red-50 transition-colors group"
                  >
                    <LogOutIcon className="w-5 h-5 text-muted-foreground group-hover:text-red-500" />
                    <span className="text-[10px] text-muted-foreground group-hover:text-red-500">Çıkış</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
