import { Link } from 'react-router-dom'
import { useCart } from '../lib/CartContext'

function formatPrice(amount, currencyCode = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

function CartLineItem({ line }) {
  const { updateQuantity, removeLine, loading } = useCart()
  const variant = line.merchandise
  const product = variant.product
  const options = variant.selectedOptions
    ?.filter(o => o.name !== 'Title')
    .map(o => `${o.name}: ${o.value}`)
    .join(' | ')

  return (
    <div className="flex gap-4 py-5 border-b border-charcoal/8">
      {/* Image */}
      <Link
        to={`/products/${product.handle}`}
        className="w-20 h-24 flex-shrink-0 bg-cream overflow-hidden"
      >
        {variant.image?.url ? (
          <img
            src={variant.image.url}
            alt={variant.image.altText || product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${product.handle}`}
          className="text-sm text-charcoal font-light leading-snug line-clamp-2 hover:text-gold transition-colors"
        >
          {product.title}
        </Link>

        {options && (
          <p className="text-[10px] text-charcoal tracking-wider mt-1 uppercase">{options}</p>
        )}

        <p className="text-sm font-medium text-charcoal mt-2">
          {formatPrice(variant.price.amount, variant.price.currencyCode)}
        </p>

        {/* Quantity + Remove */}
        <div className="flex items-center justify-between mt-3">
          <div className="inline-flex items-center border border-charcoal/15 rounded-sm">
            <button
              onClick={() => updateQuantity(line.id, line.quantity - 1)}
              disabled={loading}
              className="w-8 h-8 text-charcoal text-sm hover:bg-cream transition-colors disabled:opacity-40"
            >−</button>
            <span className="w-8 text-center text-xs font-medium">{line.quantity}</span>
            <button
              onClick={() => updateQuantity(line.id, line.quantity + 1)}
              disabled={loading}
              className="w-8 h-8 text-charcoal text-sm hover:bg-cream transition-colors disabled:opacity-40"
            >+</button>
          </div>

          <button
            onClick={() => removeLine(line.id)}
            disabled={loading}
            className="text-charcoal hover:text-red-500 transition-colors disabled:opacity-40"
            aria-label="Remove"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CartDrawer() {
  const { cart, drawerOpen, setDrawerOpen, loading, totalQuantity, goToCheckout } = useCart()
  const lines = cart?.lines?.nodes || []
  const subtotal = cart?.cost?.subtotalAmount
  const total = cart?.cost?.totalAmount

  return (
    <div className={`fixed inset-0 z-[60] ${drawerOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer — right se slide */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xs tracking-[0.25em] uppercase font-medium text-charcoal">
              Your Cart
            </h2>
            {totalQuantity > 0 && (
              <span className="bg-gold text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {totalQuantity}
              </span>
            )}
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-charcoal hover:text-charcoal transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart items — scrollable */}
        {lines.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {lines.map(line => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>

            {/* Footer — totals + checkout */}
            <div className="border-t border-charcoal/10 px-6 py-5 bg-cream/50">
              {/* Free shipping progress */}
              <div className="mb-4">
                {total && Number(total.amount) >= 999 ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-light">
                    <span>🎉</span>
                    <span>You've unlocked <strong className="font-medium">free shipping!</strong></span>
                  </div>
                ) : (
                  <div className="text-xs text-charcoal font-light">
                    Add <span className="font-medium text-charcoal">
                      {formatPrice(999 - Number(total?.amount || 0))}
                    </span> more for free shipping
                  </div>
                )}
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs tracking-[0.2em] uppercase text-charcoal font-light">Subtotal</span>
                <span className="text-lg font-medium text-charcoal">
                  {subtotal && formatPrice(subtotal.amount, subtotal.currencyCode)}
                </span>
              </div>

              <p className="text-[10px] text-charcoal mb-4 font-light">
                Shipping & taxes calculated at checkout
              </p>

              {/* Checkout button */}
              <button
                onClick={goToCheckout}
                disabled={loading}
                className="w-full bg-gold text-white text-xs tracking-[0.25em] uppercase font-medium py-4 hover:brightness-90 transition-all duration-300 mb-3 disabled:opacity-60"
              >
                {loading ? 'Processing...' : 'Checkout'}
              </button>

              {/* Continue shopping */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full border border-charcoal/15 text-charcoal text-xs tracking-[0.2em] uppercase font-light py-3 hover:border-gold hover:text-gold transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          /* Empty cart */
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <svg className="w-16 h-16 text-charcoal mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="font-serif text-xl text-charcoal mb-2">Your cart is empty</p>
            <p className="text-xs text-charcoal font-light mb-8">Looks like you haven't added anything yet</p>
            <button
              onClick={() => setDrawerOpen(false)}
              className="bg-gold text-white text-xs tracking-[0.25em] uppercase font-medium px-10 py-3 hover:brightness-90 transition-all"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
