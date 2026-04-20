import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { shopifyFetch, COLLECTION_PRODUCTS_QUERY } from '../lib/shopify'

// ── YE CHANGE KARO jab doosri collection dikhani ho ──
const COLLECTION_HANDLE = 'shop-all'
const PRODUCTS_TO_SHOW  = 10  // 5 columns × 2 rows = 10

function formatPrice(amount, currencyCode = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

// ── Tag → Display Badge mapping ──
// Sab badges theme color (gold = #ac7783) mein hain, Vasansi brand ke saath
const TAG_BADGES = [
  { match: ['ready to ship', 'ready-to-ship'], label: 'Ready to Ship' },
  { match: ['new arrival', 'new-arrival', 'new'], label: 'New Arrival' },
  { match: ['bestseller', 'best seller', 'best-seller'], label: 'Best Seller' },
  { match: ['limited', 'limited edition'], label: 'Limited' },
  { match: ['sale', 'on sale'], label: 'Sale' },
]

// Normalize: lowercase + strip Shopify theme prefix + remove spaces/hyphens
// "_label_Ready to Ship" → "readytoship"
// "Ready-To-Ship"        → "readytoship"
const normalize = (s) => (s || '')
  .toLowerCase()
  .replace(/^_label_/, '')   // Shopify theme label prefix hata do
  .replace(/[-_\s]+/g, '')

function getBadge(tags = []) {
  const normalizedTags = tags.map(normalize)
  for (const badge of TAG_BADGES) {
    const normalizedMatches = badge.match.map(normalize)
    if (normalizedMatches.some(m => normalizedTags.includes(m))) {
      return badge
    }
  }
  return null
}

function ProductCard({ product }) {
  const imgUrl = product.featuredImage?.url
  const imgAlt = product.featuredImage?.altText || product.title

  const price = product.priceRange?.minVariantPrice
  const compareAt = product.compareAtPriceRange?.minVariantPrice
  const hasDiscount = compareAt && Number(compareAt.amount) > Number(price?.amount)
  const discount = hasDiscount
    ? Math.round((1 - Number(price.amount) / Number(compareAt.amount)) * 100)
    : 0

  // Priority: Shopify tag badge > discount badge
  const tagBadge = getBadge(product.tags)

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group cursor-pointer block"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '3/4' }}>
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={imgAlt}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        )}

        {/* Tag badge — top-right, rounded pill, theme gold color */}
        {tagBadge ? (
          <span className="absolute top-0 right-0 bg-gold text-white text-[12px] tracking-wider capitalize px-3 py-1  font-light shadow-sm">
            {tagBadge.label}
          </span>
        ) : hasDiscount ? (
          <span className="absolute top-3 right-3 bg-gold text-white text-[10px] tracking-wider px-3 py-1 rounded-full font-light shadow-sm">
            {discount}% Off
          </span>
        ) : null}

        {/* Dark overlay + Quick View on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
          <span className="bg-white text-charcoal text-xs tracking-[0.2em] uppercase px-6 py-3 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Quick View
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-2 text-center">
        <h3 className="text-charcoal text-sm font-light leading-snug mb-2 line-clamp-2 group-hover:text-gold transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 justify-center">
          {price && (
            <span className="text-charcoal font-medium text-sm">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
          )}
          {hasDiscount && (
            <span className="text-charcoal text-sm line-through font-light">
              {formatPrice(compareAt.amount, compareAt.currencyCode)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div>
      <div className="bg-gray-100 animate-pulse" style={{ aspectRatio: '3/4' }} />
      <div className="pt-4 pb-2">
        <div className="h-3 bg-gray-100 rounded mb-2 animate-pulse" />
        <div className="h-3 w-1/3 bg-gray-100 rounded mx-auto animate-pulse" />
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    shopifyFetch(COLLECTION_PRODUCTS_QUERY, {
      handle: COLLECTION_HANDLE,
      first: PRODUCTS_TO_SHOW,
    })
      .then(data => {
        const nodes = data?.collection?.products?.nodes
        if (nodes?.length) {
          // Debug: dekho Shopify se actually kya tags aa rahe hain
          console.log('🔍 Products tags from Shopify:',
            nodes.map(p => ({ title: p.title, tags: p.tags }))
          )
          setProducts(nodes)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-4 lg:py-8 bg-cream">
      <div className="max-w-8xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-3 lg:mb-6">
          <h2 className="font-serif text-lg lg:text-[22px] font-light text-charcoal uppercase tracking-wide">
            Shop All
          </h2>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4">
          {loading
            ? [...Array(PRODUCTS_TO_SHOW)].map((_, i) => <SkeletonCard key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>

        {/* VIEW ALL button */}
        <div className="text-center mt-8 lg:mt-5">
          <a
            href={`/collections/${COLLECTION_HANDLE}`}
            className="inline-block bg-gold text-white text-[10px] lg:text-xs tracking-[0.25em] uppercase font-medium px-8 lg:px-12 py-3 lg:py-4 hover:bg-charcoal transition-all duration-300"
          >
            View All
          </a>
        </div>

      </div>
    </section>
  )
}
