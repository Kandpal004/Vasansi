import { createContext, useContext, useEffect, useState } from 'react'
import { shopifyFetch, SHOP_INFO_QUERY } from './shopify'
import { useMeta } from './meta'

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [shop, setShop] = useState(null)

  useEffect(() => {
    shopifyFetch(SHOP_INFO_QUERY)
      .then(data => {
        if (data?.shop) setShop(data.shop)
      })
      .catch(() => {})
  }, [])

  return <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>
}

export function useShop() {
  return useContext(ShopContext)
}

// Default meta for the app — only used when page hasn't set its own.
// All values sourced from Shopify Shop object (shop.name, shop.description, brand).
export function useDefaultMeta() {
  const shop = useShop()
  const title = shop?.name || ''
  const description = shop?.brand?.shortDescription || shop?.description || ''
  const image = shop?.brand?.coverImage?.image?.url || shop?.brand?.logo?.image?.url || ''
  const url = shop?.primaryDomain?.url || ''

  useMeta({ title, description, image, url })
}
