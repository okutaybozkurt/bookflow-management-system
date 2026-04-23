'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: string
  from: 'bot' | 'user'
  text: string
}

const initialMessages: Message[] = [
  {
    id: '1',
    from: 'bot',
    text: 'Selam! Kitap arayışında veya siparişinde yardıma mı ihtiyacın var? Ben buradayım!',
  },
  {
    id: '2',
    from: 'user',
    text: 'Merhaba, kargo takibi hakkında bilgi alabilir miyim?',
  },
  {
    id: '3',
    from: 'bot',
    text: 'Tabii ki! Sipariş numaranızı paylaşırsanız kargo durumunuzu hemen kontrol edebilirim. 📦',
  },
]

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [isOpen, messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: 'Mesajınız alındı! En kısa sürede size dönüş yapacağız. Başka bir konuda yardımcı olabilir miyim?',
      }
      setMessages((prev) => [...prev, botMsg])
    }, 900)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
          style={{ maxHeight: '420px' }}
        >
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">BookFlow Canlı Destek</p>
                <p className="text-white/70 text-[11px] mt-0.5">Genellikle birkaç dakika içinde yanıt verir</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20" style={{ minHeight: '240px', maxHeight: '280px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                    msg.from === 'bot'
                      ? 'bg-primary text-white'
                      : 'bg-foreground text-white'
                  }`}
                >
                  {msg.from === 'bot' ? 'B' : 'S'}
                </div>
                <div
                  className={`max-w-[200px] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.from === 'bot'
                      ? 'bg-white border border-border text-foreground rounded-tl-none'
                      : 'bg-primary text-white rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Mesajınızı yazın..."
                className="flex-1 text-xs px-3 py-2 border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
              />
              <button
                onClick={sendMessage}
                className="w-8 h-8 bg-primary hover:bg-primary/90 rounded-lg flex items-center justify-center text-white transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <span className="bg-foreground text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md animate-pulse">
            Canlı Destek
          </span>
        )}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="w-14 h-14 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 pulse-orange"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </div>
  )
}
