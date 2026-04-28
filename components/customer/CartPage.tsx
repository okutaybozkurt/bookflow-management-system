'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react'
import { useApp } from '@/lib/store'

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartQty, setCustomerView, openBook, createOrder } = useApp()
  const [paymentMode, setPaymentMode] = useState<'card' | 'transfer'>('card')
  const [installments, setInstallments] = useState(1)

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 29.90
  const total = subtotal + shipping

  const installmentOptions = [
    { months: 1, amount: total, total: total },
    { months: 3, amount: total / 3, total: total },
    { months: 6, amount: (total * 1.05) / 6, total: total * 1.05 },
    { months: 9, amount: (total * 1.10) / 9, total: total * 1.10 },
    { months: 12, amount: (total * 1.15) / 12, total: total * 1.15 },
  ]

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

          {/* Payment Section */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-muted/30 border-b border-border flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">Ödeme Seçenekleri</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Payment Methods */}
              <div className="flex gap-4">
                <button
                  onClick={() => setPaymentMode('card')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMode === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                >
                  <CreditCard className={`w-6 h-6 ${paymentMode === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-bold ${paymentMode === 'card' ? 'text-primary' : 'text-muted-foreground'}`}>Kredi / Banka Kartı</span>
                </button>
                <button
                  onClick={() => setPaymentMode('transfer')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMode === 'transfer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                >
                  <div className="w-6 h-6 flex items-center justify-center font-bold text-lg">₺</div>
                  <span className={`text-sm font-bold ${paymentMode === 'transfer' ? 'text-primary' : 'text-muted-foreground'}`}>Havale / EFT</span>
                </button>
              </div>

              {paymentMode === 'card' && (
                <div className="space-y-6">
                  {/* Card Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">Kart Üzerindeki İsim</label>
                      <input type="text" placeholder="AD SOYAD" className="w-full px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:border-primary outline-none text-sm transition-colors uppercase" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">Kart Numarası</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:border-primary outline-none text-sm transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">S. Kullanma Tarihi</label>
                      <input type="text" placeholder="AA / YY" className="w-full px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:border-primary outline-none text-sm transition-colors text-center" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">CVC / CVV</label>
                      <input type="text" placeholder="***" className="w-full px-4 py-2.5 bg-muted/20 border border-border rounded-xl focus:border-primary outline-none text-sm transition-colors text-center" />
                    </div>
                  </div>

                  {/* Installments */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Taksit Seçenekleri</label>
                    <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                      {installmentOptions.map((opt) => (
                        <button
                          key={opt.months}
                          onClick={() => setInstallments(opt.months)}
                          className={`w-full flex items-center justify-between p-4 text-sm transition-colors ${installments === opt.months ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${installments === opt.months ? 'border-primary' : 'border-muted'}`}>
                              {installments === opt.months && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                            <span className={installments === opt.months ? 'font-bold text-foreground' : 'text-muted-foreground'}>
                              {opt.months === 1 ? 'Tek Çekim' : `${opt.months} Taksit`}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${installments === opt.months ? 'text-primary' : 'text-foreground'}`}>
                              {opt.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                            </p>
                            {opt.months > 1 && (
                              <p className="text-[10px] text-muted-foreground uppercase font-bold">
                                Toplam: {opt.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {paymentMode === 'transfer' && (
                <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">İş Bankası (KitapÜssü A.Ş.)</p>
                    <p className="text-sm font-bold text-foreground font-mono">TR56 0006 4000 0012 3456 7890 01</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Lütfen açıklama kısmına sipariş numaranızı yazmayı unutmayınız. Siparişiniz havale onayından sonra hazırlanacaktır.
                    </p>
                  </div>
                </div>
              )}
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
                {(installments > 1 ? installmentOptions.find(o => o.months === installments)?.total || total : total).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </span>
            </div>

            <button 
              onClick={createOrder}
              className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
            >
              Ödemeyi Yap ve Siparişi Tamamla
            </button>

            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-green-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">256-bit SSL Güvenli Ödeme</span>
              </div>
              <div className="flex gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Master" className="h-4 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" className="h-4 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
