import { demoApi } from './services'
import { errorMessage } from './api'

type AddToast = (message: string, type: 'success' | 'error' | 'info') => void

export const DEMO_CONFIRM: Record<'golden' | 'junk', string> = {
  golden: 'Sunum Moduna (Altın Veri) geçilsin mi? Mevcut kitaplar ve siparişler sıfırlanır.',
  junk: 'Demo Moduna (Kirli Veri) dönülsün mü? Mevcut kitaplar ve siparişler sıfırlanır.',
}

/** Sunum/demo verisini backend'de sıfırlar; başarılıysa true döner. */
export async function runDemoReset(mode: 'golden' | 'junk', addToast: AddToast): Promise<boolean> {
  try {
    await demoApi.reset(mode)
    addToast(mode === 'golden' ? 'Sunum Hazır! (Altın Veri)' : 'Demo Modu Aktif (Kirli Veri)', 'success')
    return true
  } catch (error) {
    addToast(errorMessage(error, 'Sıfırlama başarısız.'), 'error')
    return false
  }
}
