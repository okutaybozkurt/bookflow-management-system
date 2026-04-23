'use client'

import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useApp } from '@/lib/store'

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartQty, setCustomerView, openBook } = useApp()

  const subtotal = cartItems.reduce((sum, i) => sum + i.book.price * i.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 29.90
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="w-9 h-9 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Sepetiniz boş</h2>
          <p className="text-muted-foreground text-sm">Beğendiğiniz kitapları sepete ekleyin.</p>
        </div>
        <button
          onClick={() => setCustomerView('home')}
          className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          Alışverişe Devam Et
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => setCustomerView('home')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Alışverişe Devam Et
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-6">
        Sepetim <span className="text-muted-foreground font-normal text-base">({cartItems.length} ürün)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items */}
        <div className="flex-1 space-y-3">
          {cartItems.map((item) => (
            <div key={item.book.id} className="bg-white border border-border rounded-xl p-4 flex gap-4">
              <button onClick={() => openBook(item.book)} className="shrink-0">
                <div className="w-20 h-28 relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item.book.cover}
                    alt={item.book.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </button>

              <div className="flex-1 flex flex-col gap-2 min-w-0">
                <button
                  onClick={() => openBook(item.book)}
                  className="text-left font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                >
                  {item.book.title}
                </button>
                <p className="text-xs text-muted-foreground">{item.book.author}</p>
                <p className="text-sm font-bold text-foreground">
                  {item.book.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                </p>

                <div className="flex items-center justify-between mt-auto">
                  {/* Quantity */}
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateCartQty(item.book.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x border-border">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.book.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal + delete */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">
                      {(item.book.price * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </span>
                    <button
                      onClick={() => removeFromCart(item.book.id)}
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white border border-border rounded-xl p-5 sticky top-24 space-y-4">
            <h2 className="font-bold text-base text-foreground">Sipariş Özeti</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Ara Toplam</span>
                <span>{subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Kargo</span>
                <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shipping === 0 ? 'Ücretsiz' : `${shipping.toFixed(2)} TL`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
                  500 TL üzeri alışverişlerde kargo ücretsiz
                </p>
              )}
            </div>

            <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
              <span>Toplam</span>
              <span className="text-primary">{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors text-sm">
              Siparişi Tamamla
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Güvenli ödeme altyapısı ile korumalıdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
