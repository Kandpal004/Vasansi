import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { shopifyFetch, COLLECTION_PAGE_QUERY, COLLECTION_FACETS_QUERY } from '../lib/shopify'
import { useMeta, pickSeo } from '../lib/meta'
import { useShop } from '../lib/ShopContext'

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

// ── Filter Drawer (mobile) + Sidebar (desktop) — Premium look ──
function FilterPanel({ filters, activeFilters, onToggle, onClearAll, filterOpen, setFilterOpen }) {
  const activeCount = activeFilters.length

  return (
    <div className={`fixed inset-0 z-50 ${filterOpen ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${filterOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setFilterOpen(false)}
      />
      <div className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${filterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/8">
          <h3 className="font-serif text-lg text-charcoal font-light">
            Filters
            {activeCount > 0 && <span className="text-gold text-sm ml-2">({activeCount})</span>}
          </h3>
          <button onClick={() => setFilterOpen(false)} className="text-charcoal hover:text-charcoal transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter sections */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <FilterSections filters={filters} activeFilters={activeFilters} onToggle={onToggle} />
        </div>

        {/* Footer */}
        <div className="border-t border-charcoal/8 px-6 py-4 flex gap-3">
          {activeCount > 0 && (
            <button
              onClick={onClearAll}
              className="flex-1 border border-charcoal text-charcoal text-[10px] tracking-[0.2em] uppercase py-3 hover:bg-charcoal hover:text-white transition-colors font-light"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setFilterOpen(false)}
            className="flex-1 bg-gold text-white text-[10px] tracking-[0.2em] uppercase py-3 font-medium"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Filter sections — premium styling ──
function FilterSections({ filters, activeFilters, onToggle }) {
  const [openSections, setOpenSections] = useState({})
  const toggle = (id) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))

  // Shopify jo bhi filters return kare sab dikhao — availability/in-stock ko skip kar do
  const SKIP = ['availability', 'in stock', 'vendor']
  const visibleFilters = filters.filter(f => {
    const l = f.label.toLowerCase()
    return !SKIP.some(s => l.includes(s))
  })

  return (
    <div>
      {visibleFilters.map(filter => {
        const isOpen = openSections[filter.id] !== false
        const isPriceRange = filter.type === 'PRICE_RANGE'

        return (
          <div key={filter.id} className="border-b border-charcoal/8 last:border-0">
            {/* Section header — label left, chevron right (live site match) */}
            <button
              onClick={() => toggle(filter.id)}
              className="w-full flex items-center justify-between py-5 text-left group"
            >
              <span className="text-[13px] tracking-[0.1em] uppercase font-semibold text-charcoal group-hover:text-charcoal transition-colors">
                {filter.label}
              </span>
              <svg
                className={`w-4 h-4 text-charcoal transition-transform duration-200 flex-shrink-0 ${isOpen ? '' : '-rotate-90'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* Content */}
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] pb-5' : 'max-h-0'}`}>
              {isPriceRange ? (
                <PriceSliderFilter filter={filter} activeFilters={activeFilters} onToggle={onToggle} />
              ) : (
                <div className="space-y-0.5 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {filter.values.map(val => {
                    const isActive = activeFilters.some(
                      af => af.filterId === filter.id && af.valueId === val.id
                    )
                    return (
                      <label
                        key={val.id}
                        className="flex items-center gap-3 py-2 cursor-pointer group/item"
                        onClick={() => onToggle(filter.id, val.id)}
                      >
                        {/* Custom checkbox — square outlined like live site */}
                        <span className={`w-[16px] h-[16px] border-[1.5px] flex items-center justify-center transition-all flex-shrink-0 ${
                          isActive
                            ? 'bg-gold border-gold'
                            : 'border-charcoal/30 group-hover/item:border-gold'
                        }`}>
                          {isActive && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-[12px] tracking-[0.08em] uppercase flex-1 transition-colors ${
                          isActive ? 'text-charcoal font-medium' : 'text-charcoal font-light group-hover/item:text-charcoal'
                        }`}>
                          {val.label}
                        </span>
                        <span className="text-[12px] text-charcoal font-light tabular-nums">
                          ({val.count})
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Premium Price Slider + Input ──
function PriceSliderFilter({ filter, activeFilters, onToggle }) {
  const priceFilter = activeFilters.find(af => af.filterId === filter.id)
  const currentInput = priceFilter ? JSON.parse(priceFilter.input) : null

  const PRICE_MIN = 0
  const PRICE_MAX = 25000
  const STEP = 100

  const [min, setMin] = useState(currentInput?.price?.min || PRICE_MIN)
  const [max, setMax] = useState(currentInput?.price?.max || PRICE_MAX)

  const apply = (newMin, newMax) => {
    const input = { price: { min: Number(newMin), max: Number(newMax) } }
    onToggle(filter.id, 'price-range', JSON.stringify(input), true)
  }

  const handleMinSlider = (e) => {
    const val = Math.min(Number(e.target.value), max - STEP)
    setMin(val)
  }

  const handleMaxSlider = (e) => {
    const val = Math.max(Number(e.target.value), min + STEP)
    setMax(val)
  }

  const handleMouseUp = () => apply(min, max)

  const minPercent = ((min - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const maxPercent = ((max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  return (
    <div>
      {/* Price display */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-charcoal font-light">₹</span>
          <input
            type="number"
            value={min}
            onChange={e => setMin(Number(e.target.value))}
            onBlur={() => apply(min, max)}
            className="w-16 text-xs text-charcoal font-medium border-b border-charcoal/15 pb-1 focus:outline-none focus:border-gold text-center bg-transparent"
          />
        </div>
        <span className="text-charcoal text-xs mx-2">—</span>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-charcoal font-light">₹</span>
          <input
            type="number"
            value={max}
            onChange={e => setMax(Number(e.target.value))}
            onBlur={() => apply(min, max)}
            className="w-16 text-xs text-charcoal font-medium border-b border-charcoal/15 pb-1 focus:outline-none focus:border-gold text-center bg-transparent"
          />
        </div>
      </div>

      {/* Dual range slider */}
      <div className="relative h-1 mb-3">
        {/* Track background */}
        <div className="absolute inset-0 bg-charcoal/10 rounded-full" />
        {/* Active range */}
        <div
          className="absolute top-0 bottom-0 bg-gold rounded-full"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        {/* Min slider */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          value={min}
          onChange={handleMinSlider}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
        />
        {/* Max slider */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          value={max}
          onChange={handleMaxSlider}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
        />
      </div>
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
          {hasDiscount && <span className="text-charcoal text-xs line-through">{formatPrice(compareAt.amount)}</span>}
        </div>
      </div>
    </Link>
  )
}

// ── Item Type tabs — single-select pill tabs on top of grid ──
function ItemTypeTabs({ filter, activeFilters, setActiveFilters }) {
  if (!filter || !filter.values?.length) return null

  const handleClick = (val) => {
    setActiveFilters(prev => {
      const isActive = prev.some(f => f.filterId === filter.id && f.valueId === val.id)
      // Same filter group ke baaki hata do
      const others = prev.filter(f => f.filterId !== filter.id)
      if (isActive) return others
      return [...others, {
        filterId: filter.id,
        valueId: val.id,
        input: val.input,
        label: val.label,
      }]
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 lg:pt-6">
      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
        {filter.values.map(val => {
          const isActive = activeFilters.some(f => f.filterId === filter.id && f.valueId === val.id)
          return (
            <button
              key={val.id}
              onClick={() => handleClick(val)}
              className={`text-[10px] lg:text-xs tracking-[0.2em] uppercase px-4 lg:px-6 py-2 lg:py-2.5 border-2 border-solid transition-all font-medium ${
                isActive
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-white text-charcoal border-charcoal hover:bg-charcoal/5'
              }`}
            >
              {val.label} <span className={isActive ? 'text-white/70' : 'text-charcoal'}>({val.count})</span>
            </button>
          )
        })}
      </div>
    </div>
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
  const [syntheticFilters, setSyntheticFilters] = useState([])
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

  // Build synthetic filters (Product Type + Size) from collection products
  useEffect(() => {
    shopifyFetch(COLLECTION_FACETS_QUERY, { handle })
      .then(data => {
        const nodes = data?.collection?.products?.nodes || []
        if (!nodes.length) { setSyntheticFilters([]); return }

        // Product Type counts
        const typeCounts = new Map()
        // Variant option counts: { optionName → Map<value, count> }
        const optionCounts = new Map()

        for (const p of nodes) {
          if (p.productType) {
            typeCounts.set(p.productType, (typeCounts.get(p.productType) || 0) + 1)
          }
          for (const opt of (p.options || [])) {
            if (!optionCounts.has(opt.name)) optionCounts.set(opt.name, new Map())
            const vmap = optionCounts.get(opt.name)
            for (const val of (opt.values || [])) {
              vmap.set(val, (vmap.get(val) || 0) + 1)
            }
          }
        }

        const built = []

        if (typeCounts.size) {
          built.push({
            id: 'facet-product-type',
            label: 'Product Type',
            type: 'LIST',
            values: [...typeCounts.entries()]
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([name, count]) => ({
                id: `type-${name}`,
                label: name,
                count,
                input: JSON.stringify({ productType: name }),
              })),
          })
        }

        // Size first, then other variant options
        const optNames = [...optionCounts.keys()]
        optNames.sort((a, b) => (a.toLowerCase() === 'size' ? -1 : b.toLowerCase() === 'size' ? 1 : 0))
        for (const name of optNames) {
          if (name.toLowerCase() === 'title') continue
          const vmap = optionCounts.get(name)
          built.push({
            id: `facet-opt-${name}`,
            label: name,
            type: 'LIST',
            values: [...vmap.entries()].map(([val, count]) => ({
              id: `opt-${name}-${val}`,
              label: val,
              count,
              input: JSON.stringify({ variantOption: { name, value: val } }),
            })),
          })
        }

        setSyntheticFilters(built)
      })
      .catch(() => setSyntheticFilters([]))
  }, [handle])

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

      // Label/input shopifyFilters ya syntheticFilters mein se jo bhi mile
      const all = [...shopifyFilters, ...syntheticFilters]
      const filter = all.find(f => f.id === filterId)
      const value = filter?.values.find(v => v.id === valueId)
      const label = value?.label || valueId

      return [...prev, { filterId, valueId, input: input || value?.input, label }]
    })
  }

  const removeFilter = (filterId, valueId) => {
    setActiveFilters(prev => prev.filter(f => !(f.filterId === filterId && f.valueId === valueId)))
  }

  const clearAllFilters = () => setActiveFilters([])

  // Collection meta — sab Shopify se (collection.seo, collection.title, etc.)
  const shop = useShop()
  const colSeo = pickSeo(collection)
  useMeta({
    title: colSeo.title ? `${colSeo.title} — ${shop?.name || ''}`.trim().replace(/— $/, '') : (shop?.name || ''),
    description: colSeo.description,
    image: collection?.image?.url,
    url: shop?.primaryDomain?.url ? `${shop.primaryDomain.url}/collections/${handle}` : undefined,
  })

  return (
    <div className="pt-[108px] lg:pt-[108px]">
      {/* Collection header */}
      <section className="relative bg-cream py-6 lg:py-10 px-4 sm:px-6 lg:px-8">
        {collection?.image?.url && (
          <>
            <img src={collection.image.url} alt={collection.image.altText || collection.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto text-center">
          <p className={`text-[10px] tracking-[0.3em] uppercase font-light mb-2 ${collection?.image ? 'text-white/80' : 'text-charcoal'}`}>Collection</p>
          <h1 className={`font-serif text-xl lg:text-4xl font-light uppercase tracking-wide ${collection?.image ? 'text-white' : 'text-charcoal'}`}>
            {loading ? 'Loading...' : collection?.title || 'Collection'}
          </h1>
        </div>
      </section>

      {/* Sort + Filter bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between border-b border-gray-100">
        {/* Filter button — desktop + mobile (opens drawer) */}
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 text-xs tracking-wider uppercase text-charcoal font-medium border border-charcoal px-4 py-2 hover:bg-charcoal hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          Filter {activeFilters.length > 0 && `(${activeFilters.length})`}
        </button>

        <p className="text-[10px] lg:text-xs tracking-wider text-charcoal font-light">
          {loading ? '...' : `${products.length} Products`}
        </p>

        <div className="flex items-center gap-2">
          <label className="text-xs tracking-wider text-charcoal font-light hidden sm:block">Sort:</label>
          <select
            value={sortIndex}
            onChange={e => setSortIndex(Number(e.target.value))}
            className="text-[10px] lg:text-xs tracking-wider text-charcoal border border-charcoal px-3 py-2 bg-white focus:outline-none focus:border-charcoal cursor-pointer font-light"
          >
            {SORT_OPTIONS.map((opt, i) => <option key={i} value={i}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      {/* Filter drawer — desktop + mobile */}
      <FilterPanel
        filters={[...shopifyFilters, ...syntheticFilters].filter(f => !/item\s*type/i.test(f.label))}
        activeFilters={activeFilters}
        onToggle={toggleFilter}
        onClearAll={clearAllFilters}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
      />

      {/* Item Type tabs — single-select */}
      <ItemTypeTabs
        filter={[...shopifyFilters, ...syntheticFilters].find(f => /item\s*type/i.test(f.label))}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />

      {/* Content area — grid (full width) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 lg:py-10">

        {/* Products */}
        <div className="min-w-0">
          <ActiveFilterChips activeFilters={activeFilters} onRemove={removeFilter} onClearAll={clearAllFilters} />

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4">
            {loading
              ? [...Array(PAGE_SIZE)].map((_, i) => <SkeletonCard key={i} />)
              : products.map(p => <ProductCard key={p.id} product={p} />)
            }
            {loadingMore && [...Array(3)].map((_, i) => <SkeletonCard key={`m-${i}`} />)}
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <p className="font-serif text-xl text-charcoal mb-2">No products found</p>
              <p className="text-charcoal text-xs mb-6">Try changing or clearing the filters</p>
              {activeFilters.length > 0 && (
                <button onClick={clearAllFilters} className="bg-gold text-white text-xs tracking-[0.2em] uppercase px-8 py-3">
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {!loading && hasMore && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}

          {loadingMore && (
            <div className="flex justify-center items-center gap-2 py-8 text-charcoal">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-[10px] tracking-widest uppercase font-light">Loading more...</span>
            </div>
          )}

          {!loading && !hasMore && products.length > 0 && (
            <p className="text-center text-[10px] tracking-widest uppercase text-charcoal font-light py-8">— End of collection —</p>
          )}
        </div>
      </div>
    </div>
  )
}
