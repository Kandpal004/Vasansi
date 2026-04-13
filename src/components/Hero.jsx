import { useState, useEffect } from 'react'
import { shopifyFetch, HERO_BANNER_QUERY } from '../lib/shopify'

// ── Ye values Shopify se same rakho — loading ke waqt bhi same text dikhe ──
const DEFAULTS = {
  heading:  'Sale Of The Year',
  subtext:  'Our Bigest',
  ctaText:  'Shop Now',
  ctaLink:  'https://www.vasansi.com/collections/shop-all',
  imageUrl: null,
}

function parseBanner(shopData) {
  if (!shopData?.shop) return null
  const s = shopData.shop
  return {
    heading:  s.heading?.value  || DEFAULTS.heading,
    subtext:  s.subtext?.value  || DEFAULTS.subtext,
    ctaText:  s.ctaText?.value  || DEFAULTS.ctaText,
    ctaLink:  s.ctaLink?.value  || DEFAULTS.ctaLink,
    imageUrl: s.image?.reference?.image?.url || null,
    imageAlt: s.image?.reference?.image?.altText || 'Vasansi Banner',
  }
}

export default function Hero() {
  const [banner, setBanner]   = useState(null)
  const [imgReady, setImgReady] = useState(false)  // image load hone ke baad true

  useEffect(() => {
    shopifyFetch(HERO_BANNER_QUERY)
      .then(data => {
        const parsed = parseBanner(data)
        if (parsed) setBanner(parsed)
      })
      .catch(() => {})
  }, [])

  const heading  = banner?.heading  || DEFAULTS.heading
  const subtext  = banner?.subtext  || DEFAULTS.subtext
  const ctaText  = banner?.ctaText  || DEFAULTS.ctaText
  const ctaLink  = banner?.ctaLink  || DEFAULTS.ctaLink
  const imageUrl = banner?.imageUrl || null
  const headingLines = heading.split('\n')

  return (
    <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">

      {/* ── Loading background — #ac7783 — jab tak image nahi aati ── */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'linear-gradient(135deg, #6B3040 0%, #ac7783 50%, #8B4A58 100%)',
          opacity: imgReady ? 0 : 1,   // image aane ke baad fade out
        }}
      />

      {/* ── Real banner image — Shopify se ── */}
      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt={banner?.imageAlt}
            onLoad={() => setImgReady(true)}   // image load hone pe background hata do
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
              imgReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Dark overlay for text readability */}
          <div className={`absolute inset-0 bg-black/45 transition-opacity duration-700 ${
            imgReady ? 'opacity-100' : 'opacity-0'
          }`} />
        </>
      )}

      {/* Decorative circles */}
      <div className="absolute right-[-10%] top-[10%] w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute right-[-5%]  top-[15%] w-[350px] h-[350px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute left-[-8%] bottom-[10%] w-[300px] h-[300px] rounded-full border border-white/5 pointer-events-none" />

      {/* ── Content — hamesha visible, koi flash nahi ── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
      
      <p className="animate-fade-up-2 text-base lg:text-lg font-light tracking-wide max-w-md text-white mx-auto mb-1  leading-relaxed uppercase">
          {subtext}
        </p>
        <h1 className="animate-fade-up-1 font-serif text-5xl sm:text-6xl lg:text-8xl font-light text-white leading-[1.05] mb-8 uppercase">
          {headingLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < headingLines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        

        {/* Sirf EK CTA — Shopify se */}
        <div className="animate-fade-up-3">
          <a
            href={ctaLink}
            className="inline-block px-10 py-4 bg-gold text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-white hover:text-charcoal transition-all duration-300"
          >
            {ctaText}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <span className="text-xs tracking-widest uppercase font-light">Scroll</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

    </section>
  )
}
