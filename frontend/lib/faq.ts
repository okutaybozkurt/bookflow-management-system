/**
 * Destek asistanının soru-cevap mantığı (saf fonksiyon, arayüzden bağımsız).
 * Cevaplar uygulamanın gerçek davranışına dayanır; olmayan özellik vaat edilmez.
 * Sipariş durumu ve kitap bilgisi gibi cevaplar canlı veriden üretilir.
 */
import type { Book, Order, OrderStatus, UserRole } from './store/types'

export interface FaqContext {
  userRole: UserRole
  orders: Order[]
  books: Book[]
}

export const QUICK_QUESTIONS = [
  'Kargom nerede?',
  'Kargo ücreti ne kadar?',
  'Siparişimi nasıl iptal ederim?',
  'Ödeme nasıl yapılır?',
]

/** Türkçe karakterleri sadeleştirip küçük harfe çevirir: "Şifre" → "sifre". */
const normalize = (text: string) =>
  text
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const has = (q: string, ...keywords: string[]) => keywords.some((k) => q.includes(k))

const STATUS_TEXT: Record<OrderStatus, string> = {
  pending: 'beklemede (hazırlanıyor)',
  shipped: 'kargoda',
  delivered: 'teslim edildi',
  cancelled: 'iptal edildi',
}

const money = (v: number) => v.toLocaleString('tr-TR', { minimumFractionDigits: 2 })

function orderStatusAnswer({ userRole, orders }: FaqContext): string {
  if (userRole === 'guest') {
    return 'Sipariş durumunuzu görmek için önce giriş yapmalısınız. Giriş yaptıktan sonra bana tekrar sorabilir ya da Hesabım > Siparişlerim sayfasına bakabilirsiniz.'
  }
  if (orders.length === 0) {
    return 'Henüz bir siparişiniz görünmüyor. Sepetinize kitap ekleyip siparişi tamamlayabilirsiniz.'
  }
  const last = orders[0]
  const others = orders.length > 1 ? `\nToplam ${orders.length} siparişiniz var; tümü Hesabım > Siparişlerim sayfasında.` : ''
  return `Son siparişiniz ${last.id} (${last.date}, ${money(last.total)} TL) şu an ${STATUS_TEXT[last.status]}.${others}`
}

/** Sorudaki kitap adı ya da yazar adı katalogda geçiyorsa gerçek bilgiyi döndürür. */
function bookAnswer(q: string, books: Book[]): string | null {
  const found = books
    .filter((b) => {
      const title = normalize(b.title)
      const author = normalize(b.author)
      return (title.length >= 3 && q.includes(title)) || (author.length >= 4 && q.includes(author))
    })
    .slice(0, 3)

  if (found.length === 0) return null

  return found
    .map((b) => `"${b.title}" (${b.author}) — ${money(b.price)} TL, ${b.stock > 0 ? `${b.stock} adet stokta` : 'şu an stokta yok'}.`)
    .join('\n')
}

export function answerQuestion(question: string, ctx: FaqContext): string {
  const q = normalize(question)

  if (!q) return 'Sorunuzu yazabilir ya da aşağıdaki başlıklardan birini seçebilirsiniz.'

  if (has(q, 'merhaba', 'selam', 'iyi gunler', 'gunaydin')) {
    return 'Merhaba! Sipariş, kargo, ödeme, hesap ve kitaplar hakkındaki sorularınızı yanıtlayabilirim.'
  }

  // Sipariş / kargo durumu
  if (has(q, 'kargom', 'siparisim nerede', 'siparis durum', 'kargo durum', 'kargo takip', 'siparisim ne zaman', 'siparislerim')) {
    return orderStatusAnswer(ctx)
  }

  // Kargo ücreti
  if (has(q, 'kargo ucret', 'kargo bedel', 'ucretsiz kargo', 'kargo ne kadar', 'kargo fiyat')) {
    return '500 TL ve üzeri siparişlerde kargo ücretsizdir. Bunun altındaki siparişlerde kargo ücreti 29,90 TL\'dir. Tutar sepet sayfasında ve sipariş özetinde görünür.'
  }

  // İptal / iade
  if (has(q, 'iptal', 'vazgec')) {
    return 'Beklemede durumundaki siparişinizi Hesabım > Siparişlerim sayfasından "Siparişi İptal Et" ile iptal edebilirsiniz; stok otomatik iade edilir. Kargoya verilen siparişler iptal edilemez.'
  }
  if (has(q, 'iade', 'degisim', 'geri ver')) {
    return 'Sitede şu an çevrimiçi iade veya değişim işlemi bulunmuyor. Henüz kargolanmamış (beklemede) siparişlerinizi iptal edebilirsiniz.'
  }

  // Ödeme
  if (has(q, 'odeme', 'kredi kart', 'taksit', 'havale', 'kapida')) {
    return 'Sitede çevrimiçi ödeme yoktur. Siparişi tamamladığınızda siparişiniz kaydedilir ve ödeme teslimat sırasında yapılır.'
  }

  // Sipariş verme
  if (has(q, 'nasil siparis', 'siparis ver', 'siparis olustur', 'sepet', 'satin al')) {
    return '1) Kitabı "Sepete Ekle" ile sepetinize atın. 2) Sepet sayfasında teslimat adresinizi yazın. 3) "Siparişi Tamamla" deyin. Sipariş vermek için giriş yapmış olmanız gerekir.'
  }

  // Hesap
  if (has(q, 'unuttum', 'sifirla', 'hatirlamiyorum')) {
    return 'Sitede otomatik şifre sıfırlama yok. Şifrenizi unuttuysanız bir yöneticiden Kullanıcılar sayfasından şifrenizi yenilemesini isteyin. Şifrenizi hatırlıyorsanız Hesabım > Şifre Değiştir bölümünü kullanın.'
  }
  if (has(q, 'sifre')) {
    return 'Şifrenizi Hesabım sayfasındaki "Şifre Değiştir" bölümünden mevcut şifrenizi girerek değiştirebilirsiniz. Şifre en az 8 karakter olmalı, harf ve rakam içermelidir.'
  }
  if (has(q, 'uye', 'kayit', 'giris', 'hesap', 'profil', 'adres')) {
    return 'Sağ üstteki "Giriş Yap" düğmesiyle kayıt olabilir veya giriş yapabilirsiniz. Ad, e-posta, telefon ve teslimat adresinizi Hesabım sayfasından güncelleyebilirsiniz.'
  }

  // Diğer özellikler
  if (has(q, 'favori')) {
    return 'Kitap kartındaki kalp simgesiyle favorilere ekleyebilirsiniz. Favorileriniz hesabınıza kaydedilir; giriş yapınca her cihazda görünür.'
  }
  if (has(q, 'yorum', 'puan', 'degerlendir')) {
    return 'Giriş yaptıktan sonra kitabın detay sayfasından 1-5 arası puan verip yorum yazabilirsiniz. Her kitaba bir yorum yapılabilir; sonradan düzenleyebilir veya silebilirsiniz.'
  }
  if (has(q, 'stok')) {
    return 'Stok adedi kitabın detay sayfasında görünür. Stokta olmayan kitap sepete eklenemez.'
  }

  // Canlı katalog bilgisi
  const book = bookAnswer(q, ctx.books)
  if (book) return book

  return 'Bu soruyu tam anlayamadım. Sipariş durumu, kargo ücreti, iptal, ödeme, hesap, favori, yorum ya da bir kitap/yazar adı hakkında soru sorabilirsiniz.'
}
