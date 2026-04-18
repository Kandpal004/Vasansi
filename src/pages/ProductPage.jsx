import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { shopifyFetch, PRODUCT_QUERY, RELATED_PRODUCTS_QUERY } from '../lib/shopify'
import { useCart } from '../lib/CartContext'

function formatPrice(amount, currencyCode = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: currencyCode,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Number(amount))
}

// ── Accordion ──
function DetailSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-charcoal/8">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 lg:py-5 text-left group">
        <span className="text-[12px] lg:text-[13px] tracking-[0.15em] uppercase text-charcoal font-medium group-hover:text-gold transition-colors">{title}</span>
        <svg className={`w-4 h-4 text-charcoal transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-out ${open ? 'max-h-[2000px] pb-5' : 'max-h-0'}`}>
        <div className="text-[13px] text-charcoal font-light leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

// ── Trust badge icons ──
function TruckIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
}
function ShieldIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
}
function ReturnIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
}

// ── Tag badges ──
const normalize = (s) => (s || '').toLowerCase().replace(/^_label_/, '').replace(/[-_\s]+/g, '')
const TAG_BADGES = [
  { match: ['ready to ship', 'ready-to-ship'], label: 'Ready to Ship' },
  { match: ['new arrival', 'new-arrival', 'new'], label: 'New Arrival' },
  { match: ['bestseller', 'best seller'], label: 'Best Seller' },
]
function getBadge(tags = []) {
  const nt = tags.map(normalize)
  for (const b of TAG_BADGES) { if (b.match.map(normalize).some(m => nt.includes(m))) return b }
  return null
}

// ── Related Product Card ──
function RelatedCard({ product }) {
  const price = product.priceRange?.minVariantPrice
  const compareAt = product.compareAtPriceRange?.minVariantPrice
  const hasDiscount = compareAt && Number(compareAt.amount) > Number(price?.amount)

  return (
    <Link to={`/products/${product.handle}`} className="group block">
      <div className="relative overflow-hidden bg-cream aspect-[3/4]">
        {product.featuredImage?.url ? (
          <img src={product.featuredImage.url} alt={product.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gray-100" />
        )}
      </div>
      <div className="pt-3 text-center">
        <h3 className="text-charcoal text-xs lg:text-sm font-light line-clamp-1 group-hover:text-gold transition-colors mb-1">{product.title}</h3>
        <div className="flex items-center gap-2 justify-center">
          {price && <span className="text-charcoal font-medium text-xs lg:text-sm">{formatPrice(price.amount)}</span>}
          {hasDiscount && <span className="text-charcoal text-xs line-through">{formatPrice(compareAt.amount)}</span>}
        </div>
      </div>
    </Link>
  )
}

// ── Image Gallery with Touch Swipe + Thumbnails ──
function ImageGallery({ images, activeImg, setActiveImg, hasDiscount, discount, title }) {
  const touchRef = useRef({ startX: 0, startY: 0, isDragging: false })
  const containerRef = useRef(null)
  const thumbContainerRef = useRef(null)

  const goTo = useCallback((idx) => {
    const nextIdx = (idx + images.length) % images.length
    setActiveImg(nextIdx)
  }, [images.length, setActiveImg])

  // Touch handlers
  const onTouchStart = (e) => {
    touchRef.current.startX = e.touches[0].clientX
    touchRef.current.startY = e.touches[0].clientY
    touchRef.current.isDragging = true
  }

  const onTouchEnd = (e) => {
    if (!touchRef.current.isDragging) return
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const diffX = touchRef.current.startX - endX
    const diffY = Math.abs(touchRef.current.startY - endY)

    // Horizontal swipe check (minimum 50px, more horizontal than vertical)
    if (Math.abs(diffX) > 50 && diffX > diffY) {
      if (diffX > 0) goTo(activeImg + 1)  // swipe left → next
      else goTo(activeImg - 1)             // swipe right → prev
    }
    touchRef.current.isDragging = false
  }

  // Auto-scroll thumbnail into view
  useEffect(() => {
    if (thumbContainerRef.current) {
      const thumb = thumbContainerRef.current.children[activeImg]
      if (thumb) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [activeImg])

  return (
    <div className="lg:col-span-7">
      {/* Main image — swipeable */}
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative bg-cream overflow-hidden aspect-[4/5] mb-2 lg:mb-3 cursor-grab active:cursor-grabbing select-none"
      >
        <img
          key={activeImg}
          src={images[activeImg]?.url}
          alt={images[activeImg]?.altText || title}
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
          style={{ animation: 'fadeIn 0.25s ease-out' }}
        />

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 lg:top-4 lg:left-4 bg-gold text-white text-[10px] lg:text-xs tracking-wider px-3 py-1 rounded-full font-light shadow-sm">
            {discount}% Off
          </span>
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeImg - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/80 hover:bg-white flex items-center justify-center text-charcoal hover:text-charcoal transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            </button>
            <button
              onClick={() => goTo(activeImg + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/80 hover:bg-white flex items-center justify-center text-charcoal hover:text-charcoal transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] tracking-wider px-2 py-1 rounded-sm font-light">
            {activeImg + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails — mobile (horizontal scroll) + desktop (grid) */}
      {images.length > 1 && (
        <div
          ref={thumbContainerRef}
          className="flex lg:grid lg:grid-cols-6 gap-1.5 lg:gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide"
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`relative flex-shrink-0 w-14 h-16 lg:w-auto lg:h-auto bg-cream overflow-hidden transition-all duration-200 aspect-square ${
                activeImg === i
                  ? 'ring-2 ring-gold ring-offset-1 opacity-100'
                  : 'opacity-40 hover:opacity-80'
              }`}
            >
              <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════
//  MAIN PRODUCT PAGE COMPONENT
// ════════════════════════════════════════════
export default function ProductPage() {
  const { handle } = useParams()
  const { addToCart, buyNow, loading: cartLoading } = useCart()

  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [activeImg, setActiveImg]   = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [quantity, setQuantity]     = useState(1)
  const [related, setRelated]       = useState([])
  const [addedToCart, setAddedToCart] = useState(false)
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const ctaRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setActiveImg(0)
    setQuantity(1)
    setRelated([])
    setAddedToCart(false)

    shopifyFetch(PRODUCT_QUERY, { handle }).then(data => {
      if (data?.product) {
        setProduct(data.product)
        // MTO override: agar product ke tags mein _rtsmto + mto-active dono hon
        // to Ready-To-Ship variants ignore karo, Made-To-Order default pick karo
        const tags = (data.product.tags || []).map(t => t.toLowerCase())
        const mtoOnly = tags.includes('_rtsmto') && tags.includes('mto-active')
        const pool = mtoOnly
          ? data.product.variants.nodes.filter(v =>
              !v.selectedOptions.some(o => o.name.toLowerCase() === 'item type' && /ready.?to.?ship/i.test(o.value))
            )
          : data.product.variants.nodes
        const first = pool.find(v => v.availableForSale) || pool[0] || data.product.variants.nodes[0]
        if (first) {
          const d = {}
          first.selectedOptions.forEach(o => { d[o.name] = o.value })
          setSelectedOptions(d)
        }
        shopifyFetch(RELATED_PRODUCTS_QUERY, { productId: data.product.id })
          .then(rd => { if (rd?.productRecommendations?.length) setRelated(rd.productRecommendations.slice(0, 4)) })
          .catch(() => {})
      }
    }).finally(() => setLoading(false))

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [handle])

  const variant = useMemo(() => {
    if (!product) return null
    return product.variants.nodes.find(v => v.selectedOptions.every(o => selectedOptions[o.name] === o.value))
  }, [product, selectedOptions])

  const images = useMemo(() => {
    if (!product) return []
    const imgs = product.images?.nodes || []
    return imgs.length ? imgs : (product.featuredImage ? [product.featuredImage] : [])
  }, [product])

  const handleAddToCart = async () => {
    if (variant) {
      await addToCart(variant.id, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  // Sticky mobile CTA — inline CTA ke near/out-of-view hone pe show karo
  useEffect(() => {
    let rafId = null
    const check = () => {
      if (!ctaRef.current) return
      const rect = ctaRef.current.getBoundingClientRect()
      // inline CTA ka top viewport ke upar chadh gaya = sticky dikhao
      setShowStickyCTA(rect.top < 20)
    }
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        check()
        rafId = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Initial + product load ke baad re-check
    check()
    const t = setTimeout(check, 200)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      clearTimeout(t)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [product])

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="pt-[108px] lg:pt-[108px]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            <div className="lg:col-span-7">
              <div className="bg-gray-100 animate-pulse aspect-[4/5] mb-3" />
              <div className="grid grid-cols-5 gap-2">{[...Array(5)].map((_, i) => <div key={i} className="bg-gray-100 animate-pulse aspect-square" />)}</div>
            </div>
            <div className="lg:col-span-5 space-y-4 py-2">
              <div className="h-3 bg-gray-100 rounded w-20 animate-pulse" />
              <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-100 rounded w-1/3 animate-pulse" />
              <div className="h-px bg-gray-100 my-6" />
              <div className="h-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-14 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="font-serif text-2xl text-charcoal mb-3">Product not found</p>
        <Link to="/" className="bg-gold text-white text-xs tracking-[0.2em] uppercase px-8 py-3 mt-4">Back to Home</Link>
      </div>
    )
  }

  const price     = variant?.price || product.priceRange?.minVariantPrice
  const compareAt = variant?.compareAtPrice || product.compareAtPriceRange?.minVariantPrice
  const hasDiscount = compareAt && Number(compareAt.amount) > Number(price?.amount)
  const discount  = hasDiscount ? Math.round((1 - Number(price.amount) / Number(compareAt.amount)) * 100) : 0
  const inStock   = variant?.availableForSale ?? product.availableForSale

  return (
    <div className="pt-[108px] lg:pt-[108px] pb-6 lg:pb-16">

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 lg:py-4">
        <nav className="flex items-center text-[10px] lg:text-xs tracking-wider text-charcoal font-light">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/collections/shop-all" className="hover:text-gold transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal truncate max-w-[150px] lg:max-w-none">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12">

          {/* ═══════ LEFT — Image Gallery with Touch Swipe ═══════ */}
          <ImageGallery
            images={images}
            activeImg={activeImg}
            setActiveImg={setActiveImg}
            hasDiscount={hasDiscount}
            discount={discount}
            title={product.title}
          />

          {/* ═══════ RIGHT — Product Info ═══════ */}
          <div className="lg:col-span-5 lg:sticky lg:top-[120px] lg:self-start py-1 lg:py-2">

            {/* Vendor + Product Type */}
            <div className="flex items-center gap-3 mb-2">
              {product.vendor && (
                <span className="text-[10px] lg:text-[11px] tracking-[0.25em] uppercase text-gold font-medium">{product.vendor}</span>
              )}
              {product.productType && (
                <>
                  <span className="text-charcoal">|</span>
                  <span className="text-[10px] lg:text-[11px] tracking-wider uppercase text-charcoal font-light">{product.productType}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl lg:text-3xl text-charcoal font-light leading-snug mb-4">{product.title}</h1>

            {/* Price block */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-xl lg:text-2xl font-medium text-charcoal">{price && formatPrice(price.amount, price.currencyCode)}</span>
              {hasDiscount && (
                <>
                  <span className="text-sm lg:text-base text-charcoal line-through font-light">{formatPrice(compareAt.amount)}</span>
                  <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-sm font-medium tracking-wider uppercase">Save {discount}%</span>
                </>
              )}
            </div>
            <p className="text-[10px] text-charcoal tracking-wider mb-5 font-light">MRP incl. of all taxes</p>

            {/* Divider */}
            <div className="h-px bg-charcoal/6 mb-5" />

            {/* Availability */}
            <div className="flex items-center gap-2 mb-5">
              <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-400'}`} />
              <span className="text-[11px] tracking-wider uppercase text-charcoal font-light">
                {inStock ? 'In Stock — Ready to Ship' : 'Currently Unavailable'}
              </span>
            </div>

            {/* ── Options (Size, Color, Item Type) ── */}
            {(() => {
              const tags = (product.tags || []).map(t => t.toLowerCase())
              const mtoOnly = tags.includes('_rtsmto') && tags.includes('mto-active')

              return product.options.map(option => {
                if (option.name === 'Title' && option.values.length === 1 && option.values[0] === 'Default Title') return null
                const selected = selectedOptions[option.name]

                // MTO override: Item Type mein Ready-To-Ship hide karo
                const isItemType = option.name.toLowerCase() === 'item type'
                const values = (mtoOnly && isItemType)
                  ? option.values.filter(v => !/ready.?to.?ship/i.test(v))
                  : option.values

                if (values.length === 0) return null

                return (
                  <div key={option.id} className="mb-5">
                    <p className="text-[11px] tracking-[0.15em] uppercase text-charcoal font-medium mb-2.5">
                      {option.name}: <span className="text-gold font-light normal-case tracking-normal ml-1">{selected}</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 lg:gap-2">
                      {values.map(value => {
                        const isActive = selected === value
                        return (
                          <button
                            key={value}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                            className={`min-w-[40px] px-3 lg:px-4 py-2 lg:py-2.5 text-[11px] tracking-wider uppercase font-light border transition-all duration-200 ${
                              isActive
                                ? 'bg-gold text-white border-gold shadow-sm'
                                : 'bg-white text-charcoal border-charcoal/12 hover:border-gold hover:text-gold'
                            }`}
                          >
                            {value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            })()}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-[11px] tracking-[0.15em] uppercase text-charcoal font-medium mb-2.5">Quantity</p>
              <div className="inline-flex items-center border border-charcoal/12">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 text-charcoal text-base hover:bg-cream transition-colors">−</button>
                <span className="w-10 text-center text-sm font-medium text-charcoal border-x border-charcoal/12">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 text-charcoal text-base hover:bg-cream transition-colors">+</button>
              </div>
            </div>

            {/* ── CTA Buttons ── */}
            <div className="mb-6">
              <div ref={ctaRef} className="grid grid-cols-2 gap-2.5">
                {/* Add to Cart */}
                <button
                  disabled={!inStock || !variant || cartLoading}
                  onClick={handleAddToCart}
                  className={`w-full text-[11px] tracking-[0.25em] uppercase font-medium py-4 transition-all duration-300 flex items-center justify-center gap-2 ${
                    addedToCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gold text-white hover:brightness-90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
                  }`}
                >
                  {addedToCart ? (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg> Added</>
                  ) : cartLoading ? 'Adding...' : inStock ? 'Add to Cart' : 'Sold Out'}
                </button>

                {/* Buy Now */}
                <button
                  disabled={!inStock || !variant || cartLoading}
                  onClick={() => variant && buyNow(variant.id, quantity)}
                  className="w-full border-[1.5px] border-charcoal text-charcoal text-[11px] tracking-[0.25em] uppercase font-medium py-4 hover:bg-charcoal hover:text-white transition-all duration-300 disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Wishlist */}
              <button className="w-full flex items-center justify-center gap-2 text-[11px] tracking-wider uppercase text-charcoal py-3 mt-2.5 hover:text-gold transition-colors font-light">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                Add to Wishlist
              </button>
            </div>

            {/* ── Trust Badges ── */}
            <div className="grid grid-cols-3 gap-3 py-5 mb-4 border-y border-charcoal/6">
              <div className="flex flex-col items-center text-center gap-1.5">
                <span className="text-gold"><TruckIcon /></span>
                <span className="text-[9px] lg:text-[10px] tracking-wider text-charcoal font-light leading-tight">Free Shipping<br />Above ₹999</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <span className="text-gold"><ShieldIcon /></span>
                <span className="text-[9px] lg:text-[10px] tracking-wider text-charcoal font-light leading-tight">100% Authentic<br />Handcrafted</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <span className="text-gold"><ReturnIcon /></span>
                <span className="text-[9px] lg:text-[10px] tracking-wider text-charcoal font-light leading-tight">15-Day Easy<br />Returns</span>
              </div>
            </div>

            {/* ── Accordions ── */}
            <DetailSection title="Description" defaultOpen>
              {product.descriptionHtml ? (
                <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              ) : (
                <p>{product.description || 'No description available.'}</p>
              )}
            </DetailSection>

            <DetailSection title="Shipping & Delivery">
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Free shipping on orders above ₹999</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Express delivery in 3-5 business days</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Standard delivery in 5-7 business days</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Cash on Delivery available</li>
              </ul>
            </DetailSection>

            <DetailSection title="Returns & Exchange">
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> 15-day hassle-free returns</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Exchange available for size changes</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Refund within 48 hours of pickup</li>
              </ul>
            </DetailSection>

            <DetailSection title="Care Instructions">
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Dry clean recommended</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Store in cool, dry place</li>
                <li className="flex items-start gap-2"><span className="text-gold mt-0.5">•</span> Iron on low heat if needed</li>
              </ul>
            </DetailSection>
          </div>

        </div>
      </div>

      {/* ═══════ Related Products ═══════ */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-12 lg:mt-20">
          <div className="h-px bg-charcoal/6 mb-10 lg:mb-14" />
          <div className="text-center mb-6 lg:mb-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal font-light mb-2">You May Also Like</p>
            <h2 className="font-serif text-xl lg:text-2xl font-light text-charcoal uppercase tracking-wide">Complete Your Look</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
            {related.map(p => <RelatedCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── Mobile Sticky CTA — bottom fixed jab inline CTA scroll out ── */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-charcoal/10 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-3 py-2.5 transition-transform duration-300 ${
          showStickyCTA ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={!inStock || !variant || cartLoading}
            onClick={handleAddToCart}
            className={`w-full text-[11px] tracking-[0.2em] uppercase font-medium py-3 transition-all duration-300 flex items-center justify-center gap-1.5 ${
              addedToCart
                ? 'bg-emerald-600 text-white'
                : 'bg-gold text-white disabled:bg-gray-200 disabled:text-gray-400'
            }`}
          >
            {addedToCart ? 'Added' : cartLoading ? 'Adding...' : inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
          <button
            disabled={!inStock || !variant || cartLoading}
            onClick={() => variant && buyNow(variant.id, quantity)}
            className="w-full border-[1.5px] border-charcoal text-charcoal text-[11px] tracking-[0.2em] uppercase font-medium py-3 disabled:border-gray-200 disabled:text-gray-300"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
