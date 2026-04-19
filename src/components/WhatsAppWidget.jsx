import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Single source of truth — baad me number change karna ho toh yahan update karo
const WHATSAPP_NUMBER = '918952070707' // country code + number, no +, no spaces
const AGENT_NAME = 'Vasansi Personal Shopper'
const WELCOME = "Hi there 👋\n\nHow can we help you today? Our team typically replies within a few minutes."

const QUICK_REPLIES = [
  { label: 'Size & Fit Query', message: "Hi! I have a question about sizing." },
  { label: 'Product Availability', message: "Hi! I want to check availability of a product." },
  { label: 'Order Status',       message: "Hi! I'd like to check my order status." },
  { label: 'Custom Design',      message: "Hi! I'm interested in a custom / made-to-order piece." },
]

function WhatsAppIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  )
}

function buildWaUrl(message) {
  const text = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false)
  const [pulse, setPulse] = useState(true)
  const [message, setMessage] = useState('')
  const location = useLocation()

  // Stop pulsing after first interaction
  useEffect(() => {
    if (open) setPulse(false)
  }, [open])

  // First-visit auto-attention: pulse dot for 30 sec then stop
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 30000)
    return () => clearTimeout(t)
  }, [])

  // Hide on checkout / cart pages (optional)
  const hidden = /\/(checkout|cart)(\/|$)/.test(location.pathname)
  if (hidden) return null

  const send = (text) => {
    const finalText = (text || message || '').trim() || 'Hi Vasansi, I have a question.'
    window.open(buildWaUrl(finalText), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Chat popup */}
      <div
        className={`fixed bottom-24 right-4 lg:right-6 z-[60] w-[88vw] max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
        role="dialog"
        aria-label="WhatsApp chat"
      >
        {/* Header */}
        <div className="bg-[#075E54] text-white px-5 py-4 flex items-center gap-3">
          <div className="relative w-12 h-12 bg-white/15 rounded-full flex items-center justify-center flex-shrink-0">
            <WhatsAppIcon className="w-7 h-7 text-white" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#075E54] rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[15px] truncate">{AGENT_NAME}</p>
            <p className="text-[11px] text-white/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Online
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close chat"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Chat body */}
        <div
          className="px-4 py-5 max-h-[55vh] overflow-y-auto"
          style={{
            backgroundColor: '#E5DDD5',
            backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><circle cx='20' cy='20' r='1' fill='%23000' opacity='0.04'/></svg>\")",
          }}
        >
          {/* Agent bubble */}
          <div className="flex mb-3">
            <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%] shadow-sm">
              <p className="text-[13px] text-charcoal leading-[1.5] whitespace-pre-line">{WELCOME}</p>
              <p className="text-[10px] text-charcoal/40 text-right mt-1">now</p>
            </div>
          </div>

          {/* Quick replies */}
          <p className="text-[10px] tracking-wider uppercase text-charcoal/60 font-medium mt-5 mb-2 px-1">Quick options</p>
          <div className="flex flex-col gap-2">
            {QUICK_REPLIES.map((q, i) => (
              <button
                key={i}
                onClick={() => send(q.message)}
                className="w-full text-left bg-white border border-black/5 hover:border-[#25D366] hover:text-[#075E54] rounded-xl px-3.5 py-2.5 text-[13px] text-charcoal font-medium transition-all flex items-center justify-between gap-2 group"
              >
                <span>{q.label}</span>
                <span className="text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message input + send */}
        <div className="bg-white border-t border-black/5 p-3 flex items-end gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none border border-black/10 rounded-full px-4 py-2 text-[13px] text-charcoal outline-none focus:border-[#25D366] transition-colors max-h-24"
          />
          <button
            onClick={() => send()}
            className="w-10 h-10 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>

        {/* Footer */}
        <div className="bg-white px-4 py-2 border-t border-black/5">
          <p className="text-[10px] text-charcoal/40 text-center">
            Powered by <span className="font-medium text-[#25D366]">WhatsApp</span>
          </p>
        </div>
      </div>

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-[60] w-14 h-14 lg:w-16 lg:h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label={open ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
      >
        {/* Pulse ring */}
        {pulse && !open && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse opacity-40" />
          </>
        )}

        {/* Icon */}
        <span className="relative">
          {open ? <CloseIcon /> : <WhatsAppIcon className="w-7 h-7 lg:w-8 lg:h-8" />}
        </span>

        {/* Badge for unread-ish indicator on first load */}
        {pulse && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            1
          </span>
        )}
      </button>

      {/* Hover tooltip (desktop only) */}
      {!open && (
        <div className="fixed bottom-7 right-24 lg:right-28 z-[59] hidden lg:block pointer-events-none">
          <div className="bg-charcoal text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 translate-x-2 transition-all duration-300 whitespace-nowrap peer-hover:opacity-100">
            Chat with us on WhatsApp
          </div>
        </div>
      )}
    </>
  )
}
