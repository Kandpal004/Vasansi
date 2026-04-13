import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { shopifyFetch, COLLECTION_PAGE_QUERY } from '../lib/shopify'

const PAGE_SIZE = 12

// ── Sort options ──
const SORT_OPTIONS = [
  { label: 'Featured',         sortKey: 'MANUAL',       reverse: false },
  { label: 'Price: Low → High', sortKey: 'PRICE',        reverse: false },
  { label: 'Price: High → Low', sortKey: 'PRICE',        reverse: true  },
  { label: 'Newest First',     sortKey: 'CREATED',      reverse: true  },
  { label: 'Best Selling',     sortKey: 'BEST_SELLING', reverse: false },
]

// ── Tag badge mapping (same as FeaturedProducts) ──
const TAG_BADGES = [
  { match: ['ready to ship', 'ready-to-ship'], label: 'Ready to Ship' },
  { match: ['new arrival', 'new-arrival', 'new'], label: 'New Arrival' },
  { match: ['bestseller', 'best seller', 'best-seller'], label: 'Best Seller' },
  { match: ['sale', 'on sale'], label: 'Sale' },
]

const normalize = (s) => (s || '')
  .toLowerCase()
  .replace(/^_label_/, '')
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

function formatPrice(amount, currencyCode = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
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
  const tagBadge = getBadge(product.tags)

  return (
    <Link to={`/products/${product.handle}`} className="group cursor-pointer block">
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

        {/* Badge */}
        {tagBadge ? (
          <span className="absolute top-3 right-3 bg-gold text-white text-[10px] tracking-wider px-3 py-1 rounded-full font-light shadow-sm">
            {tagBadge.label}
          </span>
        ) : hasDiscount ? (
          <span className="absolute top-3 right-3 bg-gold text-white text-[10px] tracking-wider px-3 py-1 rounded-full font-light shadow-sm">
            {discount}% Off
          </span>
        ) : null}

        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
          <span className="bg-white text-charcoal text-xs tracking-[0.2em] uppercase px-6 py-3 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Quick View
          </span>
        </div>
      </div>

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
            <span className="text-charcoal/40 text-sm line-through font-light">
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

export default function CollectionPage() {
  const { handle } = useParams()

  const [collection, setCollection] = useState(null)
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore]       = useState(false)
  const [endCursor, setEndCursor]   = useState(null)
  const [sortIndex, setSortIndex]   = useState(0)

  // Sentinel ref — intersection observer isi element ko watch karega
  const sentinelRef = useRef(null)
  // Latest state ko access karne ke liye ref (observer closure issue avoid)
  const stateRef = useRef({ hasMore, loadingMore, endCursor, sortIndex, handle })
  stateRef.current = { hasMore, loadingMore, endCursor, sortIndex, handle }

  // Fetch products (fresh ya pagination)
  const fetchProducts = async (opts = {}) => {
    const { after = null } = opts
    const sort = SORT_OPTIONS[stateRef.current.sortIndex]

    const data = await shopifyFetch(COLLECTION_PAGE_QUERY, {
      handle: stateRef.current.handle,
      first: PAGE_SIZE,
      after,
      sortKey: sort.sortKey,
      reverse: sort.reverse,
    })

    if (!data?.collection) return null
    return data.collection
  }

  // Load more — useCallback taaki observer ke liye stable reference rahe
  const loadMore = useCallback(async () => {
    const { hasMore: hm, loadingMore: lm, endCursor: ec } = stateRef.current
    if (!hm || lm) return

    setLoadingMore(true)
    const col = await fetchProducts({ after: ec })
    if (col) {
      setProducts(prev => [...prev, ...col.products.nodes])
      setHasMore(col.products.pageInfo.hasNextPage)
      setEndCursor(col.products.pageInfo.endCursor)
    }
    setLoadingMore(false)
  }, [])

  // Initial fetch + sort change
  useEffect(() => {
    setLoading(true)
    setProducts([])
    setEndCursor(null)

    fetchProducts()
      .then(col => {
        if (col) {
          setCollection(col)
          setProducts(col.products.nodes)
          setHasMore(col.products.pageInfo.hasNextPage)
          setEndCursor(col.products.pageInfo.endCursor)
        }
      })
      .finally(() => setLoading(false))

    // Scroll to top on page/sort change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [handle, sortIndex])

  // ── Infinite Scroll — IntersectionObserver setup ──
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Jab sentinel viewport mein aaye aur hasMore ho — loadMore call
        if (entries[0].isIntersecting && stateRef.current.hasMore && !stateRef.current.loadingMore) {
          loadMore()
        }
      },
      {
        // 200px pehle trigger — smooth experience
        rootMargin: '200px 0px',
        threshold: 0,
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore, loading])

  return (
    <div className="pt-16 lg:pt-16">
      {/* ── Collection Header / Banner — compact ── */}
      <section className="relative bg-cream py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
        {collection?.image?.url && (
          <>
            <img
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/45" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto text-center">
          <p className={`text-[10px] tracking-[0.3em] uppercase font-light mb-2 ${collection?.image ? 'text-white/80' : 'text-charcoal/40'}`}>
            Collection
          </p>
          <h1 className={`font-serif text-2xl lg:text-4xl font-light uppercase tracking-wide ${collection?.image ? 'text-white' : 'text-charcoal'}`}>
            {loading ? 'Loading...' : collection?.title || 'Collection'}
          </h1>
          {collection?.description && (
            <p className={`text-xs lg:text-sm font-light max-w-2xl mx-auto mt-2 ${collection?.image ? 'text-white/80' : 'text-charcoal/60'}`}>
              {collection.description}
            </p>
          )}
        </div>
      </section>

      {/* ── Sort + Count bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between border-b border-gray-100">
        <p className="text-xs tracking-wider text-charcoal/60 font-light">
          {loading ? '...' : `${products.length} Products`}
        </p>

        <div className="flex items-center gap-3">
          <label className="text-xs tracking-wider text-charcoal/60 font-light hidden sm:block">Sort by:</label>
          <select
            value={sortIndex}
            onChange={(e) => setSortIndex(Number(e.target.value))}
            className="text-xs tracking-wider text-charcoal border border-charcoal/20 px-4 py-2 bg-white focus:outline-none focus:border-charcoal cursor-pointer font-light"
          >
            {SORT_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading
            ? [...Array(PAGE_SIZE)].map((_, i) => <SkeletonCard key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)
          }
          {loadingMore && [...Array(4)].map((_, i) => <SkeletonCard key={`more-${i}`} />)}
        </div>

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-charcoal/60 mb-2">No products found</p>
            <p className="text-charcoal/40 text-sm">This collection is empty or doesn't exist.</p>
          </div>
        )}

        {/* Infinite scroll sentinel — observer isko watch karta hai */}
        {!loading && hasMore && (
          <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
        )}

        {/* Loading indicator during infinite scroll */}
        {loadingMore && (
          <div className="flex justify-center items-center gap-2 py-10 text-charcoal/60">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-xs tracking-widest uppercase font-light">Loading more...</span>
          </div>
        )}

        {/* End of results message */}
        {!loading && !hasMore && products.length > 0 && (
          <p className="text-center text-xs tracking-widest uppercase text-charcoal/40 font-light py-10">
            — End of collection —
          </p>
        )}
      </section>
    </div>
  )
}
