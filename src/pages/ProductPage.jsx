import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { shopifyFetch, PRODUCT_QUERY, RELATED_PRODUCTS_QUERY } from '../lib/shopify'
import { useCart } from '../lib/CartContext'

function formatPrice(amount, currencyCode = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

function AccordionSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-charcoal/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-xs tracking-[0.25em] uppercase font-medium text-charcoal group-hover:text-gold transition-colors">
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-charcoal/50 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[2000px] pb-6' : 'max-h-0'}`}>
        <div className="text-sm text-charcoal/65 font-light leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

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

function RelatedProductCard({ product }) {
  const price = product.priceRange?.minVariantPrice
  const compareAt = product.compareAtPriceRange?.minVariantPrice
  const hasDiscount = compareAt && Number(compareAt.amount) > Number(price?.amount)
  const badge = getBadge(product.tags)

  return (
    <Link to={`/products/${product.handle}`} className="group block">
      <div className="relative overflow-hidden bg-cream" style={{ aspectRatio: '3/4' }}>
        {product.featuredImage?.url ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        {badge && (
          <span className="absolute top-3 right-3 bg-gold text-white text-[10px] tracking-wider px-3 py-1 rounded-full font-light">
            {badge.label}
          </span>
        )}
      </div>
      <div className="pt-4 text-center">
        <h3 className="text-charcoal text-sm font-light line-clamp-1 group-hover:text-gold transition-colors mb-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 justify-center">
          {price && <span className="text-charcoal font-medium text-sm">{formatPrice(price.amount)}</span>}
          {hasDiscount && <span className="text-charcoal/40 text-sm line-through">{formatPrice(compareAt.amount)}</span>}
        </div>
      </div>
    </Link>
  )
}

export default function ProductPage() {
  const { handle } = useParams()

  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [selectedOptions, setSelectedOptions]   = useState({})
  const [quantity, setQuantity]     = useState(1)
  const [related, setRelated]       = useState([])
  const { addToCart, buyNow, loading: cartLoading } = useCart()

  useEffect(() => {
    setLoading(true)
    setSelectedImageIdx(0)
    setQuantity(1)
    setRelated([])

    shopifyFetch(PRODUCT_QUERY, { handle })
      .then(data => {
        if (data?.product) {
          setProduct(data.product)
          const firstAvail = data.product.variants.nodes.find(v => v.availableForSale)
                          || data.product.variants.nodes[0]
          if (firstAvail) {
            const defaults = {}
            firstAvail.selectedOptions.forEach(opt => { defaults[opt.name] = opt.value })
            setSelectedOptions(defaults)
          }
          // Related products fetch
          shopifyFetch(RELATED_PRODUCTS_QUERY, { productId: data.product.id })
            .then(rd => {
              if (rd?.productRecommendations?.length) {
                setRelated(rd.productRecommendations.slice(0, 4))
              }
            })
            .catch(() => {})
        }
      })
      .finally(() => setLoading(false))

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [handle])

  const currentVariant = useMemo(() => {
    if (!product) return null
    return product.variants.nodes.find(v =>
      v.selectedOptions.every(opt => selectedOptions[opt.name] === opt.value)
    )
  }, [product, selectedOptions])

  const images = useMemo(() => {
    if (!product) return []
    const imgs = product.images?.nodes || []
    return imgs.length ? imgs : (product.featuredImage ? [product.featuredImage] : [])
  }, [product])

  if (loading) {
    return (
      <div className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-3">
              <div className="bg-gray-100 animate-pulse" style={{ aspectRatio: '4/5' }} />
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => <div key={i} className="bg-gray-100 animate-pulse" style={{ aspectRatio: '4/5' }} />)}
              </div>
            </div>
            <div className="space-y-5 py-4">
              <div className="h-3 bg-gray-100 rounded w-24 animate-pulse" />
              <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-100 rounded w-1/3 animate-pulse" />
              <div className="h-px bg-gray-100 my-4" />
              <div className="h-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-14 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-24 lg:pt-28 min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="font-serif text-3xl text-charcoal/60 mb-3">Product not found</p>
        <p className="text-charcoal/40 text-sm mb-6">The product you are looking for doesn't exist.</p>
        <Link to="/" className="inline-block bg-gold text-white text-xs tracking-[0.25em] uppercase font-medium px-10 py-3 hover:bg-charcoal transition-all">
          Back to Home
        </Link>
      </div>
    )
  }

  const price     = currentVariant?.price || product.priceRange?.minVariantPrice
  const compareAt = currentVariant?.compareAtPrice || product.compareAtPriceRange?.minVariantPrice
  const hasDiscount = compareAt && Number(compareAt.amount) > Number(price?.amount)
  const discount = hasDiscount ? Math.round((1 - Number(price.amount) / Number(compareAt.amount)) * 100) : 0
  const inStock = currentVariant?.availableForSale ?? product.availableForSale

  return (
    <div className="pt-20 lg:pt-24 pb-10">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs tracking-wider text-charcoal/40 font-light">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/collections/shop-all" className="hover:text-gold transition-colors">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal/70">{product.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* ── LEFT — Image Gallery ── */}
          <div>
            <div className="relative bg-cream overflow-hidden mb-3" style={{ aspectRatio: '4/5' }}>
              {images[selectedImageIdx] && (
                <img
                  src={images[selectedImageIdx].url}
                  alt={images[selectedImageIdx].altText || product.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300"
                />
              )}
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-gold text-white text-xs tracking-wider px-4 py-1.5 rounded-full font-light shadow-sm">
                  {discount}% Off
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`relative bg-cream overflow-hidden transition-all duration-200 ${
                      selectedImageIdx === i ? 'ring-2 ring-gold ring-offset-2' : 'opacity-50 hover:opacity-100'
                    }`}
                    style={{ aspectRatio: '4/5' }}
                  >
                    <img src={img.url} alt={img.altText || ''} className="absolute inset-0 w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT — Product Details ── */}
          <div className="lg:sticky lg:top-24 lg:self-start py-2">

            {product.vendor && (
              <p className="text-[10px] tracking-[0.35em] uppercase text-gold font-medium mb-3">
                {product.vendor}
              </p>
            )}

            <h1 className="font-serif text-3xl lg:text-4xl text-charcoal font-light leading-tight mb-5">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl font-medium text-charcoal">
                {price && formatPrice(price.amount, price.currencyCode)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-charcoal/35 line-through font-light">
                    {formatPrice(compareAt.amount, compareAt.currencyCode)}
                  </span>
                  <span className="text-xs bg-gold/15 text-gold px-2 py-0.5 rounded font-medium tracking-wide">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] text-charcoal/40 tracking-wider mb-6">MRP incl. of all taxes</p>

            {/* Divider */}
            <div className="h-px bg-charcoal/8 mb-6" />

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-400'}`} />
              <span className="text-xs tracking-wider uppercase text-charcoal/55 font-light">
                {inStock ? 'In Stock — Ready to Ship' : 'Currently Unavailable'}
              </span>
            </div>

            {/* Options (Size, Color, Item Type — sab Shopify se aate hain) */}
            {product.options.map(option => {
              if (option.name === 'Title' && option.values.length === 1 && option.values[0] === 'Default Title') return null
              const selectedVal = selectedOptions[option.name]

              return (
                <div key={option.id} className="mb-6">
                  <p className="text-xs tracking-[0.2em] uppercase text-charcoal font-medium mb-3">
                    {option.name}:
                    <span className="ml-2 text-gold font-light normal-case tracking-normal">
                      {selectedVal}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map(value => {
                      const isSelected = selectedVal === value
                      return (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                          className={`px-5 py-2.5 text-xs tracking-wider uppercase font-light border transition-all duration-200 ${
                            isSelected
                              ? 'bg-gold text-white border-gold'
                              : 'bg-white text-charcoal border-charcoal/15 hover:border-gold hover:text-gold'
                          }`}
                        >
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs tracking-[0.2em] uppercase text-charcoal font-medium mb-3">Quantity</p>
              <div className="inline-flex items-center border border-charcoal/15 rounded-sm">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 text-charcoal text-lg hover:bg-cream transition-colors"
                >−</button>
                <span className="w-14 text-center text-sm font-medium border-x border-charcoal/15">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-11 h-11 text-charcoal text-lg hover:bg-cream transition-colors"
                >+</button>
              </div>
            </div>

            {/* Add to cart + Wishlist */}
            <div className="flex gap-3 mb-6">
              <button
                disabled={!inStock || !currentVariant || cartLoading}
                onClick={() => currentVariant && addToCart(currentVariant.id, quantity)}
                className="flex-1 bg-gold text-white text-xs tracking-[0.25em] uppercase font-medium py-4 hover:brightness-90 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {cartLoading ? 'Adding...' : inStock ? 'Add to Cart' : 'Sold Out'}
              </button>
              <button className="w-14 h-14 border border-gold text-gold flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-300" aria-label="Wishlist">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>

            {/* Buy Now — seedha Shopify checkout pe redirect */}
            <button
              disabled={!inStock || !currentVariant || cartLoading}
              onClick={() => currentVariant && buyNow(currentVariant.id, quantity)}
              className="w-full border-2 border-gold text-gold text-xs tracking-[0.25em] uppercase font-medium py-4 hover:bg-gold hover:text-white transition-all duration-300 mb-8 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              {cartLoading ? 'Redirecting...' : 'Buy Now'}
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mb-8 py-5 border-y border-charcoal/8">
              {[
                { icon: '🚚', text: 'Free Shipping\nabove ₹999' },
                { icon: '✓', text: 'Authentic\nHandcrafted' },
                { icon: '↩', text: '15-Day Easy\nReturns' },
              ].map(({ icon, text }) => (
                <div key={text} className="text-center">
                  <span className="text-lg mb-1 block">{icon}</span>
                  <p className="text-[10px] tracking-wider text-charcoal/55 font-light leading-tight whitespace-pre-line">{text}</p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div>
              <AccordionSection title="Description" defaultOpen>
                {product.descriptionHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                ) : (
                  <p>{product.description || 'No description available.'}</p>
                )}
              </AccordionSection>

              <AccordionSection title="Shipping & Delivery">
                <p className="mb-2">• Free shipping on orders above ₹999</p>
                <p className="mb-2">• Express delivery in 3-5 business days</p>
                <p className="mb-2">• Standard delivery in 5-7 business days</p>
                <p>• Cash on Delivery available</p>
              </AccordionSection>

              <AccordionSection title="Returns & Exchange">
                <p className="mb-2">• 15-day hassle-free returns</p>
                <p className="mb-2">• Exchange available for size changes</p>
                <p>• Refund initiated within 48 hours of pickup</p>
              </AccordionSection>

              <AccordionSection title="Care Instructions">
                <p className="mb-2">• Dry clean recommended for best results</p>
                <p className="mb-2">• Store in a cool, dry place away from sunlight</p>
                <p>• Iron on low heat if needed</p>
              </AccordionSection>
            </div>

          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/40 font-light mb-2">You may also like</p>
            <h2 className="font-serif text-2xl lg:text-3xl font-light text-charcoal">Related Products</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {related.map(p => (
              <RelatedProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
