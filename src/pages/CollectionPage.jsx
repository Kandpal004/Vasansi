import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { shopifyFetch, COLLECTION_PAGE_QUERY } from '../lib/shopify'

const PAGE_SIZE = 12

const SORT_OPTIONS = [
  { label: 'Featured',          sortKey: 'MANUAL',       reverse: false },
  { label: 'Price: Low → High', sortKey: 'PRICE',        reverse: false },
  { label: 'Price: High → Low', sortKey: 'PRICE',        reverse: true  },
  { label: 'Newest First',      sortKey: 'CREATED',      reverse: true  },
  { label: 'Best Selling',      sortKey: 'BEST_SELLING', reverse: false },
]

const TAG_BADGES = [
  { match: ['ready to ship', 'ready-to-ship'], label: 'Ready to Ship' },
  { match: ['new arrival', 'new-arrival', 'new'], label: 'New Arrival' },
  { match: ['bestseller', 'best seller'], label: 'Best Seller' },
  { match: ['sale', 'on sale'], label: 'Sale' },
]

const normalize = (s) => (s || '').toLowerCase().replace(/^_label_/, '').replace(/[-_\s]+/g, '')

function getBadge(tags = []) {
  const nt = tags.map(normalize)
  for (const b of TAG_BADGES) { if (b.match.map(normalize).some(m => nt.includes(m))) return b }
  return null
}

function formatPrice(amount, currencyCode = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: currencyCode,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Number(amount))
}

// ── Filter Drawer (mobile) + Sidebar (desktop) ──
function FilterPanel({ filters, activeFilters, onToggle, onClearAll, filterOpen, setFilterOpen }) {
  const activeCount = activeFilters.length

  return (
    <>
      {/* Mobile filter drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${filterOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${filterOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setFilterOpen(false)}
        />
        <div className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${filterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal/10">
            <h3 className="text-xs tracking-[0.25em] uppercase font-medium text-charcoal">
              Filters {activeCount > 0 && <span className="text-gold ml-1">({activeCount})</span>}
            </h3>
            <button onClick={() => setFilterOpen(false)} className="text-charcoal/50 hover:text-charcoal">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <FilterSections filters={filters} activeFilters={activeFilters} onToggle={onToggle} />
          </div>

          <div className="border-t border-charcoal/10 px-5 py-4 flex gap-3">
            {activeCount > 0 && (
              <button
                onClick={onClearAll}
                className="flex-1 border border-charcoal/20 text-charcoal text-xs tracking-[0.2em] uppercase py-3 hover:border-charcoal transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setFilterOpen(false)}
              className="flex-1 bg-gold text-white text-xs tracking-[0.2em] uppercase py-3"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs tracking-[0.25em] uppercase font-medium text-charcoal">Filters</h3>
            {activeCount > 0 && (
              <button
                onClick={onClearAll}
                className="text-[10px] tracking-wider uppercase text-gold hover:text-charcoal transition-colors"
              >
                Clear All ({activeCount})
              </button>
            )}
          </div>
          <FilterSections filters={filters} activeFilters={activeFilters} onToggle={onToggle} />
        </div>
      </div>
    </>
  )
}

// ── Filter sections rendering ──
function FilterSections({ filters, activeFilters, onToggle }) {
  const [openSections, setOpenSections] = useState({})

  const toggle = (id) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))

  // Skip internal Shopify filters
  const visibleFilters = filters.filter(f =>
    f.values.length > 1 && !f.label.toLowerCase().includes('product metafield')
  )

  return (
    <div className="space-y-0">
      {visibleFilters.map(filter => {
        const isOpen = openSections[filter.id] !== false // default open
        const isPriceRange = filter.type === 'PRICE_RANGE'

        return (
          <div key={filter.id} className="border-b border-charcoal/8">
            <button
              onClick={() => toggle(filter.id)}
              className="w-full flex items-center justify-between py-4 text-left group"
            >
              <span className="text-xs tracking-[0.15em] uppercase font-medium text-charcoal group-hover:text-gold transition-colors">
                {filter.label}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-charcoal/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {isOpen && (
              <div className="pb-4">
                {isPriceRange ? (
                  <PriceRangeFilter filter={filter} activeFilters={activeFilters} onToggle={onToggle} />
                ) : (
                  <div className="space-y-1 max-h-52 overflow-y-auto">
                    {filter.values.map(val => {
                      const isActive = activeFilters.some(
                        af => af.filterId === filter.id && af.valueId === val.id
                      )
                      return (
                        <label
                          key={val.id}
                          className="flex items-center gap-3 py-1.5 cursor-pointer group/item"
                        >
                          <span className={`w-4 h-4 border flex items-center justify-center transition-all ${
                            isActive ? 'bg-gold border-gold' : 'border-charcoal/25 group-hover/item:border-gold'
                          }`}>
                            {isActive && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                            )}
                          </span>
                          <span className={`text-xs font-light transition-colors ${isActive ? 'text-charcoal font-normal' : 'text-charcoal/70 group-hover/item:text-charcoal'}`}>
                            {val.label}
                          </span>
                          <span className="text-[10px] text-charcoal/30 ml-auto">{val.count}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Price range filter ──
function PriceRangeFilter({ filter, activeFilters, onToggle }) {
  const priceFilter = activeFilters.find(af => af.filterId === filter.id)
  const currentInput = priceFilter ? JSON.parse(priceFilter.input) : null
  const [min, setMin] = useState(currentInput?.price?.min || '')
  const [max, setMax] = useState(currentInput?.price?.max || '')

  const apply = () => {
    const input = { price: {} }
    if (min) input.price.min = Number(min)
    if (max) input.price.max = Number(max)
    if (min || max) {
      onToggle(filter.id, 'price-range', JSON.stringify(input), true)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder="₹ Min"
        value={min}
        onChange={e => setMin(e.target.value)}
        className="flex-1 px-3 py-2 text-xs border border-charcoal/15 focus:outline-none focus:border-gold font-light w-0"
      />
      <span className="text-charcoal/30 text-xs">—</span>
      <input
        type="number"
        placeholder="₹ Max"
        value={max}
        onChange={e => setMax(e.target.value)}
        className="flex-1 px-3 py-2 text-xs border border-charcoal/15 focus:outline-none focus:border-gold font-light w-0"
      />
      <button
        onClick={apply}
        className="px-3 py-2 bg-gold text-white text-xs hover:brightness-90 transition-all"
      >
        Go
      </button>
    </div>
  )
}

// ── Active filter chips (shown above grid) ──
function ActiveFilterChips({ activeFilters, onRemove, onClearAll }) {
  if (activeFilters.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {activeFilters.map(af => (
        <button
          key={af.valueId}
          onClick={() => onRemove(af.filterId, af.valueId)}
          className="inline-flex items-center gap-1.5 bg-cream text-charcoal text-[10px] tracking-wider uppercase px-3 py-1.5 font-light hover:bg-gold hover:text-white transition-all group"
        >
          {af.label}
          <svg className="w-3 h-3 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-[10px] tracking-wider uppercase text-gold hover:text-charcoal transition-colors ml-2"
      >
        Clear All
      </button>
    </div>
  )
}

function ProductCard({ product }) {
  const imgUrl = product.featuredImage?.url
  const price = product.priceRange?.minVariantPrice
  const compareAt = product.compareAtPriceRange?.minVariantPrice
  const hasDiscount = compareAt && Number(compareAt.amount) > Number(price?.amount)
  const discount = hasDiscount ? Math.round((1 - Number(price.amount) / Number(compareAt.amount)) * 100) : 0
  const tagBadge = getBadge(product.tags)

  return (
    <Link to={`/products/${product.handle}`} className="group block">
      <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
        {imgUrl ? (
          <img src={imgUrl} alt={product.featuredImage?.altText || product.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        {tagBadge ? (
          <span className="absolute top-2 right-2 bg-gold text-white text-[9px] lg:text-[10px] tracking-wider px-2 lg:px-3 py-0.5 lg:py-1 rounded-full font-light shadow-sm">{tagBadge.label}</span>
        ) : hasDiscount ? (
          <span className="absolute top-2 right-2 bg-gold text-white text-[9px] lg:text-[10px] tracking-wider px-2 lg:px-3 py-0.5 lg:py-1 rounded-full font-light shadow-sm">{discount}% Off</span>
        ) : null}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <span className="bg-white text-charcoal text-[10px] lg:text-xs tracking-[0.15em] lg:tracking-[0.2em] uppercase px-4 lg:px-6 py-2 lg:py-3 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Quick View</span>
        </div>
      </div>
      <div className="pt-3 pb-2 text-center">
        <h3 className="text-charcoal text-xs lg:text-sm font-light leading-snug mb-1 line-clamp-2 group-hover:text-gold transition-colors">{product.title}</h3>
        <div className="flex items-center gap-2 justify-center">
          {price && <span className="text-charcoal font-medium text-xs lg:text-sm">{formatPrice(price.amount)}</span>}
          {hasDiscount && <span className="text-charcoal/40 text-xs line-through">{formatPrice(compareAt.amount)}</span>}
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div>
      <div className="bg-gray-100 animate-pulse aspect-[3/4]" />
      <div className="pt-3 pb-2"><div className="h-3 bg-gray-100 rounded mb-2 animate-pulse" /><div className="h-3 w-1/3 bg-gray-100 rounded mx-auto animate-pulse" /></div>
    </div>
  )
}

// ── Main Page Component ──
export default function CollectionPage() {
  const { handle } = useParams()

  const [collection, setCollection] = useState(null)
  const [products, setProducts]     = useState([])
  const [shopifyFilters, setShopifyFilters] = useState([])
  const [activeFilters, setActiveFilters]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore]       = useState(false)
  const [endCursor, setEndCursor]   = useState(null)
  const [sortIndex, setSortIndex]   = useState(0)
  const [filterOpen, setFilterOpen] = useState(false)

  const sentinelRef = useRef(null)
  const stateRef = useRef({ hasMore, loadingMore, endCursor, sortIndex, handle, activeFilters })
  stateRef.current = { hasMore, loadingMore, endCursor, sortIndex, handle, activeFilters }

  // Build Shopify filter input from activeFilters
  const buildFilterInput = (afs) => {
    return afs.map(af => JSON.parse(af.input))
  }

  const fetchProducts = async (opts = {}) => {
    const { after = null } = opts
    const sort = SORT_OPTIONS[stateRef.current.sortIndex]
    const filters = buildFilterInput(stateRef.current.activeFilters)

    const data = await shopifyFetch(COLLECTION_PAGE_QUERY, {
      handle: stateRef.current.handle,
      first: PAGE_SIZE,
      after,
      sortKey: sort.sortKey,
      reverse: sort.reverse,
      filters: filters.length > 0 ? filters : undefined,
    })

    if (!data?.collection) return null
    return data.collection
  }

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

  // Initial + sort/filter change
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
          if (col.products.filters) setShopifyFilters(col.products.filters)
        }
      })
      .finally(() => setLoading(false))

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [handle, sortIndex, activeFilters])

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && stateRef.current.hasMore && !stateRef.current.loadingMore) loadMore()
      },
      { rootMargin: '200px 0px', threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore, loading])

  // ── Filter handlers ──
  const toggleFilter = (filterId, valueId, input, replace = false) => {
    setActiveFilters(prev => {
      if (replace) {
        return [...prev.filter(f => f.filterId !== filterId), { filterId, valueId, input, label: valueId }]
      }
      const existing = prev.find(f => f.filterId === filterId && f.valueId === valueId)
      if (existing) {
        return prev.filter(f => !(f.filterId === filterId && f.valueId === valueId))
      }

      // Find the label from shopifyFilters
      const filter = shopifyFilters.find(f => f.id === filterId)
      const value = filter?.values.find(v => v.id === valueId)
      const label = value?.label || valueId

      return [...prev, { filterId, valueId, input: input || value?.input, label }]
    })
  }

  const removeFilter = (filterId, valueId) => {
    setActiveFilters(prev => prev.filter(f => !(f.filterId === filterId && f.valueId === valueId)))
  }

  const clearAllFilters = () => setActiveFilters([])

  return (
    <div className="pt-16 lg:pt-16">
      {/* Collection header */}
      <section className="relative bg-cream py-6 lg:py-10 px-4 sm:px-6 lg:px-8">
        {collection?.image?.url && (
          <>
            <img src={collection.image.url} alt={collection.image.altText || collection.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto text-center">
          <p className={`text-[10px] tracking-[0.3em] uppercase font-light mb-2 ${collection?.image ? 'text-white/80' : 'text-charcoal/40'}`}>Collection</p>
          <h1 className={`font-serif text-xl lg:text-4xl font-light uppercase tracking-wide ${collection?.image ? 'text-white' : 'text-charcoal'}`}>
            {loading ? 'Loading...' : collection?.title || 'Collection'}
          </h1>
        </div>
      </section>

      {/* Sort + Filter bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between border-b border-gray-100">
        {/* Mobile filter button */}
        <button
          onClick={() => setFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 text-xs tracking-wider uppercase text-charcoal font-light border border-charcoal/20 px-4 py-2 hover:border-gold hover:text-gold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          Filter {activeFilters.length > 0 && `(${activeFilters.length})`}
        </button>

        <p className="text-[10px] lg:text-xs tracking-wider text-charcoal/50 font-light">
          {loading ? '...' : `${products.length} Products`}
        </p>

        <div className="flex items-center gap-2">
          <label className="text-xs tracking-wider text-charcoal/50 font-light hidden sm:block">Sort:</label>
          <select
            value={sortIndex}
            onChange={e => setSortIndex(Number(e.target.value))}
            className="text-[10px] lg:text-xs tracking-wider text-charcoal border border-charcoal/15 px-3 py-2 bg-white focus:outline-none focus:border-gold cursor-pointer font-light"
          >
            {SORT_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      {/* Content area — sidebar + grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 lg:py-10 flex gap-8">

        {/* Filter sidebar (desktop) + drawer (mobile) */}
        <FilterPanel
          filters={shopifyFilters}
          activeFilters={activeFilters}
          onToggle={toggleFilter}
          onClearAll={clearAllFilters}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
        />

        {/* Products */}
        <div className="flex-1 min-w-0">
          <ActiveFilterChips activeFilters={activeFilters} onRemove={removeFilter} onClearAll={clearAllFilters} />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-5">
            {loading
              ? [...Array(PAGE_SIZE)].map((_, i) => <SkeletonCard key={i} />)
              : products.map(p => <ProductCard key={p.id} product={p} />)
            }
            {loadingMore && [...Array(3)].map((_, i) => <SkeletonCard key={`m-${i}`} />)}
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <p className="font-serif text-xl text-charcoal/50 mb-2">No products found</p>
              <p className="text-charcoal/40 text-xs mb-6">Try changing or clearing the filters</p>
              {activeFilters.length > 0 && (
                <button onClick={clearAllFilters} className="bg-gold text-white text-xs tracking-[0.2em] uppercase px-8 py-3">
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {!loading && hasMore && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}

          {loadingMore && (
            <div className="flex justify-center items-center gap-2 py-8 text-charcoal/50">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-[10px] tracking-widest uppercase font-light">Loading more...</span>
            </div>
          )}

          {!loading && !hasMore && products.length > 0 && (
            <p className="text-center text-[10px] tracking-widest uppercase text-charcoal/30 font-light py-8">— End of collection —</p>
          )}
        </div>
      </div>
    </div>
  )
}
