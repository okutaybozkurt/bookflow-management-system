'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MapPin, Loader2 } from 'lucide-react'
import { useApp } from '@/lib/store'

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartQty, setCustomerView, openBook, createOrder, userAddress, userRole, setAuthModalOpen } = useApp()
  const [address, setAddress] = useState(userAddress)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Profildeki adres sonradan yüklenirse (oturum geri yüklenirken) alan otomatik dolar.
  useEffect(() => { setAddress((prev) => prev || userAddress) }, [userAddress])

  // Ön izleme; kesin tutar backend tarafından hesaplanır (aynı kurallar: 500 TL üzeri kargo ücretsiz).
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal >= 500 ? 0 : 29.90
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (userRole === 'guest') {
      setAuthModalOpen(true)
      return
    }
    if (address.trim().length < 10) {
      setAddressError('Lütfen en az 10 karakterlik bir teslimat adresi girin.')
      return
    }
    setSubmitting(true)
    await createOrder(address.trim())
    setSubmitting(false)
  }

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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items & Payment */}
        <div className="flex-1 space-y-6">
          {/* Cart Items */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-foreground">
              <ShoppingBag className="w-4 h-4" />
              Ürün Listesi
            </div>
            {cartItems.map((item, index) => (
              <div key={item.id} className="bg-white border border-border rounded-xl p-4 flex gap-4">
                <button onClick={() => openBook(item)} className="shrink-0">
                  <div className="w-20 h-28 relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </button>
   
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <button
                    onClick={() => openBook(item)}
                    className="text-left font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.title}
                  </button>
                  <p className="text-xs text-muted-foreground">{item.author}</p>
                  <p className="text-sm font-bold text-foreground">
                    {item.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                  </p>
   
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
   
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary">
                        {(item.price * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
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

          {/* Delivery Address */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-muted/30 border-b border-border flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">Teslimat Adresi</h2>
            </div>
            <div className="p-6 space-y-3">
              <textarea
                rows={3}
                value={address}
                onChange={(e) => { setAddress(e.target.value); setAddressError(null) }}
                placeholder="Mahalle, cadde/sokak, bina ve daire no, ilçe / il"
                className={`w-full px-4 py-3 bg-muted/20 border rounded-xl outline-none text-sm resize-none transition-colors ${addressError ? 'border-red-400' : 'border-border focus:border-primary'}`}
              />
              {addressError && <p role="alert" className="text-xs text-red-600">{addressError}</p>}
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Ödeme, teslimat sırasında yapılır. Bu uygulamada çevrimiçi ödeme entegrasyonu bulunmamaktadır.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white border border-border rounded-2xl p-6 sticky top-24 space-y-6 shadow-sm">
            <h2 className="font-bold text-lg text-foreground">Sipariş Özeti</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Ara Toplam</span>
                <span className="font-medium">{subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Kargo</span>
                <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-medium'}>
                  {shipping === 0 ? 'Ücretsiz' : `${shipping.toFixed(2)} TL`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 leading-relaxed">
                  500 TL üzeri alışverişlerde kargo ücretsiz avantajından yararlanın!
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-bold text-foreground">Ödenecek Tutar</span>
              <span className="text-xl font-extrabold text-primary">
                {total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {submitting ? 'Sipariş oluşturuluyor...' : 'Siparişi Tamamla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
