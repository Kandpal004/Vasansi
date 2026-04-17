import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { shopifyFetch, PAGE_QUERY, SHOP_POLICIES_QUERY } from '../lib/shopify'

const POLICY_KEYS = {
  'privacy-policy': 'privacyPolicy',
  'shipping-policy': 'shippingPolicy',
  'refund-policy': 'refundPolicy',
  'terms-of-service': 'termsOfService',
  'subscription-policy': 'subscriptionPolicy',
}

export default function StaticPage({ isPolicy = false }) {
  const { handle } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setPage(null)
    window.scrollTo({ top: 0 })

    if (isPolicy) {
      shopifyFetch(SHOP_POLICIES_QUERY)
        .then(data => {
          const key = POLICY_KEYS[handle]
          const policy = data?.shop?.[key]
          if (policy) setPage(policy)
        })
        .finally(() => setLoading(false))
    } else {
      shopifyFetch(PAGE_QUERY, { handle })
        .then(data => {
          if (data?.page) setPage(data.page)
        })
        .finally(() => setLoading(false))
    }
  }, [handle, isPolicy])

  return (
    <div className="pt-[108px] lg:pt-[108px] pb-16 lg:pb-24 bg-white">

      {/* Hero */}
      <section className="bg-cream py-12 lg:py-20 px-4 sm:px-6 lg:px-8 mb-10 lg:mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-medium mb-3">
            {isPolicy ? 'Legal' : 'Vasansi'}
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-light text-charcoal uppercase tracking-wide">
            {loading ? 'Loading…' : page?.title || 'Page not found'}
          </h1>
          <div className="w-16 h-px bg-charcoal mx-auto mt-6" />
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 animate-pulse" style={{ width: `${80 + (i % 3) * 7}%` }} />
            ))}
          </div>
        ) : page ? (
          <div
            className="prose-content text-charcoal text-[15px] lg:text-base leading-[1.9] font-light"
            dangerouslySetInnerHTML={{ __html: page.body || '' }}
          />
        ) : (
          <div className="text-center py-16">
            <p className="font-serif text-2xl text-charcoal font-light mb-3">Content coming soon</p>
            <p className="text-sm text-charcoal/70 mb-8 font-light">Ye page abhi Shopify pe publish nahi hua hai.</p>
            <Link
              to="/"
              className="inline-block border-2 border-charcoal text-charcoal text-xs tracking-[0.25em] uppercase px-8 py-3 hover:bg-charcoal hover:text-white transition-colors font-semibold"
            >
              Back to Home
            </Link>
          </div>
        )}
      </section>

    </div>
  )
}
