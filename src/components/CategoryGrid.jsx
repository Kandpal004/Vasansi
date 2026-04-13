import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { shopifyFetch, buildCollectionsByHandleQuery } from '../lib/shopify'

// ── YE HANDLES CHANGE KARO — jo collections homepage pe dikhani hain ──
// Shopify Admin → Collections → URL mein handle milega
// e.g. vasansi.com/collections/smart-casuals → handle = "smart-casuals"
const FEATURED_HANDLES = [
  'daily-wear',
  'gowns-and-anarkali-dresses',
  'designer-and-party-wear-sarees',
  'shop-all',
  'party-wear-sharara-suits',
  'women-kurti-sets',
]

// Fallback gradients — agar collection ki image nahi hai
const GRADIENTS = [
  'linear-gradient(135deg, #5C0F2A 0%, #8B1A4A 60%, #A8235F 100%)',
  'linear-gradient(135deg, #0D3B1F 0%, #1A5C32 60%, #236B3D 100%)',
  'linear-gradient(135deg, #7A4A08 0%, #B87514 60%, #C9892A 100%)',
  'linear-gradient(135deg, #0D1F4A 0%, #1A3470 60%, #243D82 100%)',
  'linear-gradient(135deg, #2E0D4A 0%, #4A1A72 60%, #5C2385 100%)',
  'linear-gradient(135deg, #3D1A0D 0%, #6B3014 60%, #8B4020 100%)',
]

export default function CategoryGrid() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Har handle ke liye alias query banti hai (c0, c1, c2, ...)
    const query = buildCollectionsByHandleQuery(FEATURED_HANDLES)

    shopifyFetch(query)
      .then(data => {
        if (!data) return
        // FEATURED_HANDLES ke order mein collections nikalo
        // c0, c1, c2, ... ye aliases hain
        const result = FEATURED_HANDLES
          .map((_, i) => data[`c${i}`])
          .filter(Boolean)    // null / missing handles hata do
        setCollections(result)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-3 w-20 bg-gray-100 rounded mx-auto mb-4" />
          <div className="h-8 w-52 bg-gray-100 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse" style={{ height: '320px' }} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">

      {/* Section header */}
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl lg:text-3xl font-light text-charcoal uppercase">
          Shop by Category
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 lg:gap-4">
        {collections.map((col, i) => {
          // Image priority: collection image → first product image → gradient fallback
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
            className="group relative overflow-hidden block"
            style={{ height: '420px' }}
          >
            {/* Background — image (collection ya product) ya gradient */}
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={imgAlt}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-110"
              />
            ) : (
              <div
                className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-110"
                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
              />
            )}

            {/* Dark gradient overlay — neeche darker for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:from-black/80 transition-all duration-500" />

            {/* Centered content — title + SHOP NOW button */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-4">
              <h3 className="uppercase font-serif text-2xl lg:text-2xl text-white font-light tracking-wide text-center mb-5 drop-shadow-md">
                {col.title}
              </h3>

              <span className="inline-block px-7 py-2.5 bg-white text-charcoal text-[11px] tracking-[0.22em] uppercase font-medium group-hover:bg-gold group-hover:text-white transition-all duration-300">
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
