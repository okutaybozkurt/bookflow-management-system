'use client'

import {
  BookOpen, Globe, BookMarked, FlaskConical, GraduationCap,
  Baby, Landmark, Brain, Lightbulb, Wand2
} from 'lucide-react'

const categories = [
  { label: 'Tümü', icon: BookOpen, color: 'text-primary', filterValue: 'Hepsi' },
  { label: 'Roman', icon: BookMarked, color: 'text-rose-500', filterValue: 'Roman' },
  { label: 'Bilim', icon: FlaskConical, color: 'text-blue-500', filterValue: 'Bilim' },
  { label: 'Ansiklopedi', icon: Globe, color: 'text-teal-500', filterValue: 'Ansiklopedi' },
  { label: 'KPSS', icon: GraduationCap, color: 'text-violet-500', filterValue: 'KPSS' },
  { label: 'Çocuk', icon: Baby, color: 'text-pink-500', filterValue: 'Çocuk' },
  { label: 'Tarih', icon: Landmark, color: 'text-amber-600', filterValue: 'Tarih' },
  { label: 'Felsefe', icon: Brain, color: 'text-indigo-500', filterValue: 'Felsefe' },
  { label: 'Kişisel Gelişim', icon: Lightbulb, color: 'text-yellow-500', filterValue: 'Kişisel Gelişim' },
  { label: 'Fantastik', icon: Wand2, color: 'text-purple-500', filterValue: 'Fantastik' },
]

interface CategoryBarProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryBar({ activeCategory, onCategoryChange }: CategoryBarProps) {

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.filterValue
            return (
              <button
                key={cat.label}
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
