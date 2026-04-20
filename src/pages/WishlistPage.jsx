import { Link } from 'react-router-dom'
import { useWishlist } from '../lib/WishlistContext'
import { useMeta } from '../lib/meta'
import { useShop } from '../lib/ShopContext'

function formatPrice(amount, currencyCode = 'INR') {
  if (!amount) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: currencyCode,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Number(amount))
}

function HeartFilledIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist()
  const shop = useShop()

  useMeta({
    title: shop?.name ? `Wishlist — ${shop.name}` : 'Wishlist',
    description: 'Your saved favourites from Vasansi Jaipur.',
    url: shop?.primaryDomain?.url ? `${shop.primaryDomain.url}/wishlist` : undefined,
  })

  return (
    <div className="pt-[108px] lg:pt-[108px] pb-16 lg:pb-24 bg-white">

      {/* Hero */}
      <section className="bg-cream py-12 lg:py-20 px-4 sm:px-6 lg:px-8 mb-10 lg:mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-medium mb-3">Your saved pieces</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-light text-charcoal uppercase tracking-wide">Wishlist</h1>
          <div className="w-16 h-px bg-charcoal mx-auto mt-6" />
          <p className="text-charcoal text-sm lg:text-base font-light leading-relaxed mt-6 max-w-xl mx-auto">
            {items.length > 0
              ? `You have ${items.length} saved ${items.length === 1 ? 'piece' : 'pieces'}.`
              : 'Start saving pieces you love for quick access later.'}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 border-2 border-charcoal/20 rounded-full flex items-center justify-center text-charcoal/30">
              <HeartFilledIcon className="w-7 h-7" />
            </div>
            <p className="font-serif text-xl lg:text-2xl text-charcoal font-light mb-3">Your wishlist is empty</p>
            <p className="text-sm text-charcoal font-light mb-8">Tap the heart on any product to save it here.</p>
            <Link
              to="/collections/shop-all"
              className="inline-block border-2 border-charcoal text-charcoal text-xs tracking-[0.25em] uppercase px-8 py-3 hover:bg-charcoal hover:text-white transition-colors font-semibold"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <>
            {/* Clear all */}
            <div className="flex justify-end mb-6">
              <button
                onClick={clear}
                className="text-[11px] tracking-[0.2em] uppercase text-charcoal hover:text-gold transition-colors font-medium"
              >
                Clear all
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
              {items.map(item => (
                <div key={item.id} className="group relative">
                  <Link to={`/products/${item.handle}`} className="block">
                    <div className="relative overflow-hidden bg-cream aspect-[3/4]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100" />
                      )}
                    </div>
                    <div className="pt-3 pb-4">
                      <h3 className="text-charcoal text-xs lg:text-sm font-light leading-snug mb-1 line-clamp-2 group-hover:text-gold transition-colors">
                        {item.title}
                      </h3>
                      {item.price && (
                        <p className="text-charcoal font-medium text-xs lg:text-sm">
                          {formatPrice(item.price, item.currencyCode)}
                        </p>
                      )}
                    </div>
                  </Link>

                  {/* Remove button (top-right) */}
                  <button
                    onClick={(e) => { e.preventDefault(); remove(item.id) }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white text-charcoal hover:text-red-500 shadow-sm flex items-center justify-center transition-all"
                    aria-label="Remove from wishlist"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

      </section>
    </div>
  )
}
