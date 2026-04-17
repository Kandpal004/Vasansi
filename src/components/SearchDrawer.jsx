import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { shopifyFetch, PREDICTIVE_SEARCH_QUERY } from '../lib/shopify'

function formatPrice(amount, currencyCode = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: currencyCode,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Number(amount))
}

const TRENDING = ['Anarkali', 'Saree', 'Kurta Set', 'Lehenga', 'Dupatta']

export default function SearchDrawer({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ products: [], collections: [], queries: [] })
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  // Focus on open
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 150)
    }
    if (!open) {
      setQuery('')
      setResults({ products: [], collections: [], queries: [] })
    }
  }, [open])

  // Escape key close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = query.trim()
    if (q.length < 2) {
      setResults({ products: [], collections: [], queries: [] })
      setLoading(false)
      return
    }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await shopifyFetch(PREDICTIVE_SEARCH_QUERY, { query: q, limit: 6 })
        const s = data?.predictiveSearch
        setResults({
          products: s?.products || [],
          collections: s?.collections || [],
          queries: s?.queries || [],
        })
      } catch {
        setResults({ products: [], collections: [], queries: [] })
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => debounceRef.current && clearTimeout(debounceRef.current)
  }, [query])

  const handleClose = () => {
    onClose()
  }

  const hasAnyResults = results.products.length || results.collections.length || results.queries.length
  const showEmpty = query.trim().length >= 2 && !loading && !hasAnyResults

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Search panel */}
      <div
        className={`absolute top-0 left-0 right-0 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-5 lg:py-7">

          {/* Input + close */}
          <div className="flex items-center gap-3 lg:gap-4">
            <svg className="w-6 h-6 text-charcoal flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for sarees, anarkalis, lehengas..."
              className="flex-1 text-lg lg:text-xl text-charcoal font-medium placeholder:text-charcoal/50 placeholder:font-light border-none outline-none bg-transparent py-2"
            />
            {loading && (
              <svg className="animate-spin w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            <button
              onClick={handleClose}
              className="text-charcoal hover:text-charcoal/70 transition-colors flex-shrink-0"
              aria-label="Close search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Results area */}
          <div className="mt-5 lg:mt-6 max-h-[70vh] overflow-y-auto">

            {/* Empty state — no query yet */}
            {query.trim().length < 2 && (
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-charcoal font-semibold mb-3">Trending searches</p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map(term => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-sm tracking-wider uppercase border border-charcoal text-charcoal px-4 py-2 hover:bg-charcoal hover:text-white transition-colors font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state — no results */}
            {showEmpty && (
              <div className="py-12 text-center">
                <p className="font-serif text-xl text-charcoal font-medium mb-1">No results for "{query}"</p>
                <p className="text-sm tracking-wider text-charcoal font-light">Try different keywords or check spelling</p>
              </div>
            )}

            {/* Query suggestions */}
            {results.queries.length > 0 && (
              <div className="mb-6">
                <p className="text-xs tracking-[0.3em] uppercase text-charcoal font-semibold mb-3">Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {results.queries.slice(0, 5).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(q.text)}
                      className="text-sm tracking-wider text-charcoal font-medium px-4 py-1.5 border border-charcoal hover:bg-charcoal hover:text-white transition-colors"
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Collections */}
            {results.collections.length > 0 && (
              <div className="mb-6">
                <p className="text-xs tracking-[0.3em] uppercase text-charcoal font-semibold mb-3">Collections</p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {results.collections.slice(0, 3).map(col => (
                    <Link
                      key={col.id}
                      to={`/collections/${col.handle}`}
                      onClick={handleClose}
                      className="flex items-center gap-3 border border-charcoal px-3 py-2 hover:bg-charcoal hover:text-white transition-colors group"
                    >
                      {col.image?.url && (
                        <img src={col.image.url} alt="" className="w-12 h-12 object-cover flex-shrink-0" />
                      )}
                      <span className="text-sm tracking-wider uppercase font-semibold line-clamp-1">
                        {col.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {results.products.length > 0 && (
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-charcoal font-semibold mb-3">Products</p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {results.products.map(p => {
                    const price = p.priceRange?.minVariantPrice
                    return (
                      <Link
                        key={p.id}
                        to={`/products/${p.handle}`}
                        onClick={handleClose}
                        className="flex gap-3 border border-charcoal p-2 hover:bg-charcoal/5 transition-colors group"
                      >
                        <div className="w-20 h-24 bg-cream flex-shrink-0 overflow-hidden">
                          {p.featuredImage?.url && (
                            <img
                              src={p.featuredImage.url}
                              alt={p.featuredImage.altText || p.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          {p.productType && (
                            <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal font-semibold mb-1 truncate">{p.productType}</p>
                          )}
                          <h4 className="text-sm lg:text-base text-charcoal font-medium line-clamp-2 group-hover:text-gold transition-colors mb-1">
                            {p.title}
                          </h4>
                          {price && (
                            <p className="text-sm text-charcoal font-semibold">
                              {formatPrice(price.amount, price.currencyCode)}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* View all results link */}
                <div className="mt-5 text-center">
                  <Link
                    to={`/collections/shop-all?q=${encodeURIComponent(query)}`}
                    onClick={handleClose}
                    className="inline-block text-sm tracking-[0.25em] uppercase border-2 border-charcoal text-charcoal px-8 py-3 hover:bg-charcoal hover:text-white transition-colors font-semibold"
                  >
                    View all results
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
