import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  shopifyFetch,
  MAIN_MENU_QUERY,
  buildCollectionsByHandleQuery,
  toRelativeUrl,
} from '../lib/shopify'

const MENU_HANDLE = 'main-menu'

// Extract collection handle from Shopify menu item URL like
//   /collections/daily-wear
function extractCollectionHandle(url) {
  if (!url) return null
  const path = toRelativeUrl(url)
  const m = path.match(/\/collections\/([^/?#]+)/)
  return m ? m[1] : null
}

function flattenMenu(items) {
  const out = []
  const walk = (arr) => {
    for (const item of arr || []) {
      out.push(item)
      if (item.items?.length) walk(item.items)
    }
  }
  walk(items)
  return out
}

export default function CategorySlider() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    shopifyFetch(MAIN_MENU_QUERY, { handle: MENU_HANDLE })
      .then(data => {
        const items = flattenMenu(data?.menu?.items || [])

        // Sirf collection-linked menu items rakho, unique handle pe dedupe
        const seen = new Set()
        const ordered = []
        for (const it of items) {
          const handle = extractCollectionHandle(it.url)
          if (!handle || seen.has(handle)) continue
          seen.add(handle)
          ordered.push({ title: it.title, handle })
        }

        if (!ordered.length) { setCategories([]); return }

        // Limit to first ~12 for slider performance
        const top = ordered.slice(0, 12)
        const handles = top.map(c => c.handle)

        // Collections ki image fetch karo
        return shopifyFetch(buildCollectionsByHandleQuery(handles))
          .then(colData => {
            if (!colData) { setCategories(top); return }
            const enriched = top.map((c, i) => {
              const col = colData[`c${i}`]
              return {
                ...c,
                image: col?.image?.url
                  || col?.products?.nodes?.[0]?.featuredImage?.url
                  || '',
              }
            })
            setCategories(enriched)
          })
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  // pt-[136px] = fixed announcement bar (44) + fixed nav (64) — content
  // fixed header ke neeche start ho
  if (loading) {
    return (
      <section className="bg-white border-b border-charcoal/8 pt-[136px] pb-3 lg:pb-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 lg:pt-3">
          <div className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-2 w-14 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  return (
    <section className="bg-white border-b border-charcoal/8 pt-[136px] pb-3 lg:pb-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 lg:pt-3">
        <div className="flex gap-4 lg:gap-8 overflow-x-auto scrollbar-hide justify-start lg:justify-center">
          {categories.map(cat => (
            <Link
              key={cat.handle}
              to={`/collections/${cat.handle}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-cream border-2 border-transparent group-hover:border-charcoal transition-all duration-300">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-charcoal/60 to-charcoal" />
                )}
              </div>
              <span className="text-[10px] lg:text-[11px] tracking-[0.12em] uppercase text-charcoal font-medium text-center whitespace-nowrap group-hover:text-gold transition-colors max-w-[80px] truncate">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
