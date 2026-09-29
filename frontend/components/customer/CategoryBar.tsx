'use client'

import {
  BookOpen, BookMarked, FlaskConical, Landmark, Brain, Lightbulb,
  Wand2, Code2, UserRound, type LucideIcon,
} from 'lucide-react'
import { useApp } from '@/lib/store'

/** Kategori adına göre ikon; eşleşme yoksa genel kitap ikonu. */
const ICONS: [RegExp, LucideIcon][] = [
  [/klasik|roman/i, BookMarked],
  [/yaz[ıi]l[ıi]m|bilgisayar|kod/i, Code2],
  [/ki[şs]isel|geli[şs]im/i, Lightbulb],
  [/kurgu|fantas/i, Wand2],
  [/tarih/i, Landmark],
  [/psikoloji|felsefe/i, Brain],
  [/biyografi|an[ıi]/i, UserRound],
  [/bilim|fen/i, FlaskConical],
]
const COLORS = ['text-rose-500', 'text-blue-500', 'text-teal-500', 'text-violet-500', 'text-pink-500', 'text-amber-600', 'text-indigo-500', 'text-yellow-500', 'text-purple-500']

const iconFor = (name: string): LucideIcon => ICONS.find(([re]) => re.test(name))?.[1] ?? BookOpen

interface CategoryBarProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

/** Kategoriler veritabanından gelir; kitabı olmayan kategori gösterilmez. */
export default function CategoryBar({ activeCategory, onCategoryChange }: CategoryBarProps) {
  const { categories } = useApp()

  const items = [
    { label: 'Tümü', icon: BookOpen, color: 'text-primary', filterValue: 'Hepsi' },
    ...categories
      .filter((c) => (c.booksCount ?? 0) > 0)
      .map((c, i) => ({ label: c.name, icon: iconFor(c.name), color: COLORS[i % COLORS.length], filterValue: c.name })),
  ]

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {items.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.filterValue
            return (
              <button
                key={cat.filterValue}
                onClick={() => onCategoryChange(cat.filterValue)}
                className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl shrink-0 transition-all border-2 ${
                  isActive
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-transparent hover:border-border hover:bg-muted text-foreground'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-primary text-white' : 'bg-muted ' + cat.color
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
