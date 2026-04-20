import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const WishlistContext = createContext(null)

const STORAGE_KEY = 'vasansi.wishlist.v1'

// Har item minimal snapshot store karta hai taaki wishlist page offline bhi dikhe
//   { id, handle, title, image, price, currencyCode, addedAt }

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* storage full / private mode — silently ignore */
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => readFromStorage())

  // Persist
  useEffect(() => { writeToStorage(items) }, [items])

  // Cross-tab sync: another tab adds/removes → reflect here
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          const next = e.newValue ? JSON.parse(e.newValue) : []
          if (Array.isArray(next)) setItems(next)
        } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const has = useCallback((id) => items.some(i => i.id === id), [items])

  const add = useCallback((product) => {
    if (!product?.id) return
    setItems(prev => {
      if (prev.some(i => i.id === product.id)) return prev
      const snapshot = {
        id: product.id,
        handle: product.handle,
        title: product.title,
        image: product.featuredImage?.url || product.image || '',
        imageAlt: product.featuredImage?.altText || product.title || '',
        price: product.priceRange?.minVariantPrice?.amount || product.price?.amount || '',
        currencyCode: product.priceRange?.minVariantPrice?.currencyCode || product.price?.currencyCode || 'INR',
        addedAt: Date.now(),
      }
      return [snapshot, ...prev]
    })
  }, [])

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const toggle = useCallback((product) => {
    if (!product?.id) return
    if (items.some(i => i.id === product.id)) remove(product.id)
    else add(product)
  }, [items, add, remove])

  const clear = useCallback(() => setItems([]), [])

  return (
    <WishlistContext.Provider value={{ items, count: items.length, has, add, remove, toggle, clear }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}
