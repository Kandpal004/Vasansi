import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { shopifyFetch, buildCollectionsByHandleQuery } from '../lib/shopify'

// ── April Edit — 3 curated collections ──
// Agar handle galat ho, Shopify Admin → Collections → URL se sahi handle le lo
// e.g. vasansi.com/collections/summer-evenings → handle = "summer-evenings"
const APRIL_HANDLES = [
  'summer-evenings',
  'haldi-mehandi-lehengas',
  'wedding-wear',
]

const GRADIENTS = [
  'linear-gradient(135deg, #7A4A08 0%, #B87514 60%, #C9892A 100%)',
  'linear-gradient(135deg, #5C0F2A 0%, #8B1A4A 60%, #A8235F 100%)',
  'linear-gradient(135deg, #2E0D4A 0%, #4A1A72 60%, #5C2385 100%)',
]

export default function AprilEdit() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const query = buildCollectionsByHandleQuery(APRIL_HANDLES)

    shopifyFetch(query)
      .then(data => {
        if (!data) return
        const result = APRIL_HANDLES
          .map((_, i) => data[`c${i}`])
          .filter(Boolean)
        setCollections(result)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-4 lg:py-8 px-3 sm:px-6 lg:px-8 max-w-8xl mx-auto">
        <div className="text-center mb-3 lg:mb-6">
          <div className="h-8 w-44 bg-gray-100 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse aspect-[3/4] lg:aspect-square" />
          ))}
        </div>
      </section>
    )
  }

  if (!collections.length) return null

  return (
    <section className="py-4 lg:py-8 px-3 sm:px-6 lg:px-8 max-w-8xl mx-auto">
      <div className="text-center mb-3 lg:mb-6">
        <h2 className="font-serif text-lg lg:text-[28px] font-light text-charcoal uppercase">
          April Edit
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-4">
        {collections.map((col, i) => {
          const collectionImg = col.image?.url
          const productImg    = col.products?.nodes?.[0]?.featuredImage?.url
          const imgUrl        = collectionImg || productImg
          const imgAlt        = col.image?.altText
                              || col.products?.nodes?.[0]?.featuredImage?.altText
                              || col.title

          return (
            <Link
              key={col.id}
              to={`/collections/${col.handle}`}
              className="group relative overflow-hidden block aspect-[3/4] lg:aspect-square"
            >
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={imgAlt}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

              <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 lg:pb-8 px-2 lg:px-4">
                <h3 className="uppercase font-serif text-sm lg:text-xl text-white font-light tracking-wide text-center mb-2 lg:mb-4 drop-shadow-md">
                  {col.title}
                </h3>
                <span className="inline-block px-4 lg:px-7 py-1.5 lg:py-2.5 bg-white text-charcoal text-[9px] lg:text-[11px] tracking-[0.18em] lg:tracking-[0.22em] uppercase font-medium group-hover:bg-gold group-hover:text-white transition-all duration-300">
                  Shop Now
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
