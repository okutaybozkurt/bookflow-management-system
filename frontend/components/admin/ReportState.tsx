import { Loader2 } from 'lucide-react'

/** Rapor sayfalarında ortak yükleniyor / hata görünümü. */
export default function ReportState({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Veriler yükleniyor...
      </div>
    )
  }
  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
  }
  return null
}

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

/** "2026-03" → "Mar 26", "2026" → "2026" */
export function periodLabel(period: string): string {
  const [year, month] = period.split('-')
  return month ? `${MONTHS[Number(month) - 1]} ${year.slice(2)}` : year
}

export const money = (v: number) => `₺${v.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`
