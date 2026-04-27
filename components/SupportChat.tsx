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
    text: 'Merhaba! KitapÜssü Canlı Destek merkezine hoş geldiniz. Size nasıl yardımcı olabilirim?',
  },
]

const quickQuestions = [
  'Kargom nerede?',
  'İade nasıl yapılır?',
  'Kitap değişimi yapabilir miyim?',
  'Ödeme seçenekleri nelerdir?',
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

  const handleQuickQuestion = (question: string) => {
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: question }
    setMessages((prev) => [...prev, userMsg])
    
    setTimeout(() => {
      let botResponse = 'Mesajınız alındı! En kısa sürede size dönüş yapacağız. Başka bir konuda yardımcı olabilir miyim?'
      
      if (question.includes('Kargo')) {
        botResponse = 'Sipariş numaranızı paylaşırsanız kargo durumunuzu hemen kontrol edebilirim. 📦'
      } else if (question.includes('İade')) {
        botResponse = 'İade işlemlerini profilinizdeki "Siparişlerim" sayfasından başlatabilirsiniz. 14 gün içinde ücretsiz iade hakkınız mevcuttur.'
      } else if (question.includes('değişimi')) {
        botResponse = 'Kitap değişimi için ürünün hasarsız olması gerekmektedir. Değişim talebinizi destek@kitapussu.com adresine iletebilirsiniz.'
      } else if (question.includes('Ödeme')) {
        botResponse = 'Tüm kredi kartları, banka kartları ve kapıda ödeme seçeneği ile güvenle alışveriş yapabilirsiniz. 💳'
      }
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: botResponse,
      }
      setMessages((prev) => [...prev, botMsg])
    }, 800)
  }

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: 'Mesajınız alındı! En kısa sürede uzman bir temsilcimiz size dönüş yapacaktır. Başka bir konuda yardımcı olabilir miyim?',
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
                <p className="text-white text-sm font-bold leading-none">KitapÜssü Canlı Destek</p>
                <p className="text-white/70 text-[11px] mt-0.5">Size nasıl yardımcı olabilirim?</p>
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
            
            {/* Contextual Actions */}
            {messages.length > 1 && messages[messages.length - 1].from === 'bot' && (
              <div className="flex flex-col gap-2 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMessages(initialMessages)}
                    className="flex-1 text-[10px] bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 px-3 py-2 rounded-xl transition-colors font-bold"
                  >
                    Başka Bir Soru Sor
                  </button>
                  <button
                    onClick={() => {
                      setMessages(initialMessages)
                      setIsOpen(false)
                    }}
                    className="flex-1 text-[10px] bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors font-bold"
                  >
                    Sohbeti Bitir
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />

            {/* Initial Quick Questions UI */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-[10px] bg-white border border-primary/30 text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-full transition-colors font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
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

      {/* Toggle Buttons */}
      <div className="flex flex-col items-end gap-3">
        {/* WhatsApp Button */}
        {!isOpen && (
          <a
            href="https://wa.me/905000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 group relative"
          >
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="absolute right-full mr-3 bg-white border border-border text-foreground text-[10px] font-bold px-2 py-1 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              WhatsApp Destek
            </span>
          </a>
        )}

        {/* Support Chat Toggle Button */}
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
    </div>
  )
}
