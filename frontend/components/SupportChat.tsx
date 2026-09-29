'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useApp } from '@/lib/store'
import { QUICK_QUESTIONS, answerQuestion } from '@/lib/faq'

interface Message {
  id: string
  from: 'bot' | 'user'
  text: string
}

const WELCOME: Message = {
  id: 'welcome',
  from: 'bot',
  text: 'Merhaba! Ben KitapÜssü destek asistanıyım. Sipariş, kargo, ödeme, hesap ve kitaplar hakkındaki sorularınızı yanıtlayabilirim.',
}

/** Basit soru-cevap asistanı: cevaplar uygulamanın gerçek verisinden ve kurallarından üretilir. */
export default function SupportChat() {
  const { userRole, orders, books } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [isOpen, messages])

  const ask = (question: string) => {
    const text = question.trim()
    if (!text) return

    const now = Date.now()
    setMessages((prev) => [
      ...prev,
      { id: `u${now}`, from: 'user', text },
      { id: `b${now}`, from: 'bot', text: answerQuestion(text, { userRole, orders, books }) },
    ])
    setInput('')
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col" style={{ maxHeight: '460px' }}>
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">Destek Asistanı</p>
                <p className="text-white/70 text-[11px] mt-0.5">Sık sorulan sorulara anında cevap</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Sohbeti kapat"
              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20" style={{ minHeight: '240px', maxHeight: '300px' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                    msg.from === 'bot' ? 'bg-primary text-white' : 'bg-foreground text-white'
                  }`}
                >
                  {msg.from === 'bot' ? 'B' : 'S'}
                </div>
                <div
                  className={`max-w-[210px] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                    msg.from === 'bot'
                      ? 'bg-white border border-border text-foreground rounded-tl-none'
                      : 'bg-primary text-white rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Hızlı sorular her zaman erişilebilir */}
            <div className="flex flex-wrap gap-2 pt-1">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="text-[10px] bg-white border border-primary/30 text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-full transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); ask(input) }}
            className="p-3 border-t border-border bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Sorunuzu yazın..."
              className="flex-1 text-xs px-3 py-2 border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
            />
            <button
              type="submit"
              aria-label="Gönder"
              className="w-8 h-8 bg-primary hover:bg-primary/90 rounded-lg flex items-center justify-center text-white transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <span className="bg-foreground text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md animate-pulse">
            Destek
          </span>
        )}
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Sohbeti kapat' : 'Destek asistanını aç'}
          className="w-14 h-14 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 pulse-orange"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        </button>
      </div>
    </div>
  )
}
