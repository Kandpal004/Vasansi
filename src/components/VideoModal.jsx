import { useEffect } from 'react'

export default function VideoModal({ open, onClose, videoUrl, title = 'Similar Styles' }) {
  // Escape key close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const isYouTube = /youtube\.com\/embed|youtu\.be/i.test(videoUrl)

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-charcoal text-white">
          <p className="text-sm tracking-[0.15em] uppercase font-medium">{title}</p>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close video"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video */}
        <div className="relative aspect-video bg-black">
          {!videoUrl ? (
            // Placeholder — video URL abhi configure nahi ki
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 bg-gradient-to-br from-charcoal to-[#6D4550]">
              <svg className="w-16 h-16 mb-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="font-serif text-2xl lg:text-3xl font-light mb-2 tracking-wide">Video Coming Soon</p>
              <p className="text-[11px] lg:text-xs tracking-[0.25em] uppercase text-white/60 font-light">Explore more similar styles shortly</p>
            </div>
          ) : isYouTube ? (
            <iframe
              src={videoUrl}
              title={title}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-contain"
              controls
              autoPlay
              playsInline
            />
          )}
        </div>
      </div>
    </div>
  )
}
