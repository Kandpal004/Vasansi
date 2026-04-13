import { useState, useEffect } from 'react'
import { shopifyFetch, PROMO_BANNERS_QUERY } from '../lib/shopify'

// Helper — field array se value find karo (multiple possible keys)
function getField(fields, ...possibleKeys) {
  for (const key of possibleKeys) {
    const f = fields.find(x => x.key === key)
    if (f?.value) return f.value
  }
  return null
}

function getImage(fields, ...possibleKeys) {
  for (const key of possibleKeys) {
    const f = fields.find(x => x.key === key)
    if (f?.reference?.image) return f.reference.image
  }
  return null
}

// Shopify metaobject fields ko ek clean object mein parse karo
// Multiple key variations try karte hain (button_1_text, button1_text, etc.)
function parseBanner(node) {
  const f = node.fields || []
  const image = getImage(f, 'image', 'banner_image', 'photo')

  return {
    id:          node.id,
    subtitle:    getField(f, 'subtitle', 'sub_title', 'overline'),
    title:       getField(f, 'title', 'heading'),
    description: getField(f, 'description', 'body', 'text'),
    button1Text: getField(f, 'button1_text', 'button_1_text', 'cta1_text', 'btn1_text', 'button1text'),
    button1Link: getField(f, 'button1_link', 'button_1_link', 'cta1_link', 'btn1_link', 'button1link'),
    button2Text: getField(f, 'button2_text', 'button_2_text', 'cta2_text', 'btn2_text', 'button2text'),
    button2Link: getField(f, 'button2_link', 'button_2_link', 'cta2_link', 'btn2_link', 'button2link'),
    imageUrl:    image?.url,
    imageAlt:    image?.altText,
  }
}

function BannerCard({ banner }) {
  return (
    <div className="group relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
      {/* Background image */}
      {banner.imageUrl ? (
        <img
          src={banner.imageUrl}
          alt={banner.imageAlt || banner.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-burgundy" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500" />

      {/* Content — centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 lg:px-10">
        {banner.subtitle && (
          <p className="text-white/80 text-[10px] lg:text-xs tracking-[0.3em] uppercase font-light mb-3">
            {banner.subtitle}
          </p>
        )}

        {banner.title && (
          <h3 className="font-serif text-3xl lg:text-5xl text-white font-light tracking-wide uppercase mb-4">
            {banner.title}
          </h3>
        )}
{/* 
        {banner.description && (
          <p className="text-white/85 text-sm lg:text-base font-light max-w-md leading-relaxed mb-6 whitespace-pre-line">
            {banner.description}
          </p>
        )} */}

        {/* Buttons */}
        {(banner.button1Text || banner.button2Text) && (
          <div className="flex flex-wrap gap-3 justify-center">
            {banner.button1Text && (
              <a
                href={banner.button1Link || '#'}
                className="inline-block bg-white text-charcoal text-[11px] tracking-[0.22em] uppercase font-medium px-7 py-2.5 hover:bg-gold hover:text-white transition-all duration-300"
              >
                {banner.button1Text}
              </a>
            )}
            {banner.button2Text && (
              <a
                href={banner.button2Link || '#'}
                className="inline-block border border-white text-white text-[11px] tracking-[0.22em] uppercase font-medium px-7 py-2.5 hover:bg-white hover:text-charcoal transition-all duration-300"
              >
                {banner.button2Text}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PromoBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    shopifyFetch(PROMO_BANNERS_QUERY)
      .then(data => {
        const nodes = data?.metaobjects?.nodes
        if (nodes?.length) {
          // Debug — actual field keys dekho
          console.log('🎯 Raw metaobject fields:',
            nodes.map(n => ({ id: n.id, fields: n.fields?.map(f => ({ key: f.key, value: f.value })) }))
          )
          const parsed = nodes.map(parseBanner)
          console.log('🎯 Parsed banners:', parsed)
          setBanners(parsed)
        }
      })
      .catch(err => {
        console.error('❌ PromoBanners fetch error:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  // Agar koi banner nahi hai to section hide karo
  if (!loading && banners.length === 0) return null

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse" style={{ aspectRatio: '16/10' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {banners.map(banner => (
              <BannerCard key={banner.id} banner={banner} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
