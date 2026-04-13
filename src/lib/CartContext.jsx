import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  shopifyFetch,
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_LINES_REMOVE,
  CART_QUERY,
} from './shopify'

const CartContext = createContext(null)

const CART_ID_KEY = 'vasansi_cart_id'

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Restore cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem(CART_ID_KEY)
    if (savedCartId) {
      shopifyFetch(CART_QUERY, { cartId: savedCartId })
        .then(data => {
          if (data?.cart && data.cart.totalQuantity > 0) {
            setCart(data.cart)
          } else {
            localStorage.removeItem(CART_ID_KEY)
          }
        })
        .catch(() => localStorage.removeItem(CART_ID_KEY))
    }
  }, [])

  // Save cart ID to localStorage
  const saveCart = useCallback((newCart) => {
    setCart(newCart)
    if (newCart?.id) {
      localStorage.setItem(CART_ID_KEY, newCart.id)
    }
  }, [])

  // Add to cart
  const addToCart = useCallback(async (variantId, quantity = 1) => {
    setLoading(true)
    try {
      const lines = [{ merchandiseId: variantId, quantity }]

      if (cart?.id) {
        const data = await shopifyFetch(CART_LINES_ADD, { cartId: cart.id, lines })
        if (data?.cartLinesAdd?.cart) {
          saveCart(data.cartLinesAdd.cart)
          setDrawerOpen(true)
          return data.cartLinesAdd.cart
        }
      }

      // Cart nahi hai ya expired — naya banao
      const data = await shopifyFetch(CART_CREATE, { lines })
      if (data?.cartCreate?.cart) {
        saveCart(data.cartCreate.cart)
        setDrawerOpen(true)
        return data.cartCreate.cart
      }
    } catch (err) {
      console.error('Cart error:', err)
    } finally {
      setLoading(false)
    }
  }, [cart, saveCart])

  // Update line quantity
  const updateQuantity = useCallback(async (lineId, quantity) => {
    if (!cart?.id) return
    setLoading(true)
    try {
      if (quantity <= 0) {
        const data = await shopifyFetch(CART_LINES_REMOVE, { cartId: cart.id, lineIds: [lineId] })
        if (data?.cartLinesRemove?.cart) saveCart(data.cartLinesRemove.cart)
      } else {
        const data = await shopifyFetch(CART_LINES_UPDATE, {
          cartId: cart.id,
          lines: [{ id: lineId, quantity }],
        })
        if (data?.cartLinesUpdate?.cart) saveCart(data.cartLinesUpdate.cart)
      }
    } catch (err) {
      console.error('Cart update error:', err)
    } finally {
      setLoading(false)
    }
  }, [cart, saveCart])

  // Remove line
  const removeLine = useCallback(async (lineId) => {
    if (!cart?.id) return
    setLoading(true)
    try {
      const data = await shopifyFetch(CART_LINES_REMOVE, { cartId: cart.id, lineIds: [lineId] })
      if (data?.cartLinesRemove?.cart) saveCart(data.cartLinesRemove.cart)
    } catch (err) {
      console.error('Cart remove error:', err)
    } finally {
      setLoading(false)
    }
  }, [cart, saveCart])

  // Buy Now — naya cart banao sirf ek product ke saath, seedha checkout
  const buyNow = useCallback(async (variantId, quantity = 1) => {
    setLoading(true)
    try {
      const data = await shopifyFetch(CART_CREATE, {
        lines: [{ merchandiseId: variantId, quantity }],
      })
      const newCart = data?.cartCreate?.cart
      if (newCart?.checkoutUrl) {
        window.location.href = newCart.checkoutUrl
      }
    } catch (err) {
      console.error('Buy now error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Checkout — existing cart ka checkoutUrl pe redirect
  const goToCheckout = useCallback(() => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl
    }
  }, [cart])

  const totalQuantity = cart?.totalQuantity || 0

  return (
    <CartContext.Provider value={{
      cart,
      drawerOpen,
      setDrawerOpen,
      loading,
      totalQuantity,
      addToCart,
      updateQuantity,
      removeLine,
      buyNow,
      goToCheckout,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
