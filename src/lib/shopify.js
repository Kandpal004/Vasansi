// ─────────────────────────────────────────────────────────────
//  Shopify Storefront API — client
//  Ye file ek "pipe" hai React aur Shopify ke beech.
//  Jab bhi hame Shopify se kuch chahiye, hum is file ka use karte hain.
// ─────────────────────────────────────────────────────────────

const SHOPIFY_STORE   = import.meta.env.VITE_SHOPIFY_STORE
const STOREFRONT_TOKEN = import.meta.env.VITE_STOREFRONT_TOKEN

// ── Core fetch function ───────────────────────────────────────
// GraphQL query bhejo → JSON data wapas aata hai
export async function shopifyFetch(query, variables = {}) {
  if (!SHOPIFY_STORE || !STOREFRONT_TOKEN) {
    // .env file nahi bani ya tokens nahi hain — fallback use hoga
    return null
  }

  const response = await fetch(
    `https://${SHOPIFY_STORE}/api/2025-04/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  )

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`)
  }

  const json = await response.json()
  return json.data
}

// ── Collections by Handle ─────────────────────────────────────
// Har handle ke liye alias use karte hain (c0, c1, c2...)
// Ye sabse reliable tarika hai specific collections fetch karne ka
export function buildCollectionsByHandleQuery(handles) {
  const aliases = handles.map((h, i) => `
    c${i}: collection(handle: "${h}") {
      id
      title
      handle
      description
      image {
        url(transform: { maxWidth: 600, maxHeight: 700, crop: CENTER })
        altText
      }
      products(first: 1) {
        nodes {
          featuredImage {
            url(transform: { maxWidth: 600, maxHeight: 700, crop: CENTER })
            altText
          }
        }
      }
    }
  `).join('\n')

  return `query CollectionsByHandle { ${aliases} }`
}

// ── Products from a Collection ────────────────────────────────
// Ek specific collection ke first N products laata hai
export const COLLECTION_PRODUCTS_QUERY = `
  query CollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: $first) {
        nodes {
          id
          title
          handle
          tags
          featuredImage {
            url(transform: { maxWidth: 600, maxHeight: 800, crop: CENTER })
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

// ── Product Detail Page ───────────────────────────────────────
// Single product by handle — all images, options, variants
export const PRODUCT_QUERY = `
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      availableForSale
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount currencyCode }
      }
      featuredImage {
        url(transform: { maxWidth: 1200, maxHeight: 1500, crop: CENTER })
        altText
      }
      images(first: 10) {
        nodes {
          url(transform: { maxWidth: 1200, maxHeight: 1500, crop: CENTER })
          altText
        }
      }
      options {
        id
        name
        values
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image {
            url(transform: { maxWidth: 1200, maxHeight: 1500, crop: CENTER })
            altText
          }
        }
      }
    }
  }
`

// ── Cart Fragment (reusable) ──────────────────────────────────
const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            image {
              url(transform: { maxWidth: 200, maxHeight: 260, crop: CENTER })
              altText
            }
            product { title handle }
            selectedOptions { name value }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
    }
  }
`

// ── Cart Mutations ───────────────────────────────────────────
export const CART_CREATE = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`

export const CART_LINES_ADD = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`

export const CART_LINES_UPDATE = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`

export const CART_LINES_REMOVE = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`

export const CART_QUERY = `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`

// ── Related Products ──────────────────────────────────────────
// Shopify AI-based recommendations — same collection ya similar products
export const RELATED_PRODUCTS_QUERY = `
  query RelatedProducts($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      tags
      featuredImage {
        url(transform: { maxWidth: 600, maxHeight: 800, crop: CENTER })
        altText
      }
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount currencyCode }
      }
    }
  }
`

// ── Collection Page — full collection with paginated products ──
// Pagination cursor based — `after` pass karo "Load More" ke liye
export const COLLECTION_PAGE_QUERY = `
  query CollectionPage($handle: String!, $first: Int!, $after: String, $sortKey: ProductCollectionSortKeys, $reverse: Boolean, $filters: [ProductFilter!]) {
    collection(handle: $handle) {
      id
      title
      description
      image {
        url(transform: { maxWidth: 2000, maxHeight: 800, crop: CENTER })
        altText
      }
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          handle
          tags
          featuredImage {
            url(transform: { maxWidth: 600, maxHeight: 800, crop: CENTER })
            altText
          }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount currencyCode }
          }
        }
      }
    }
  }
`

// ── Main Navigation Menu ──────────────────────────────────────
// Shopify Admin → Online Store → Navigation mein Menu banta hai
// "main-menu" default handle hai — agar tumne naam change kiya to yahan update karna
export const MAIN_MENU_QUERY = `
  query MainMenu($handle: String!) {
    menu(handle: $handle) {
      id
      title
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
          type
        }
      }
    }
  }
`

// Helper — Shopify absolute URL ko relative path mein convert karo
// "https://vasansi-jaipur.myshopify.com/collections/sarees" → "/collections/sarees"
export function toRelativeUrl(url) {
  if (!url) return '#'
  try {
    const u = new URL(url)
    return u.pathname + u.search
  } catch {
    return url
  }
}

// ── Promo Banners (Metaobjects) ──────────────────────────────
// Sab fields fetch karte hain — jo bhi keys Shopify mein hain, mil jayenge
export const PROMO_BANNERS_QUERY = `
  query PromoBanners {
    metaobjects(type: "promo_banner", first: 4) {
      nodes {
        id
        handle
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url(transform: { maxWidth: 1000, maxHeight: 700, crop: CENTER })
                altText
              }
            }
          }
        }
      }
    }
  }
`

// ── Banner Query ──────────────────────────────────────────────
// Shopify ke "Shop" metafields se banner ka data laata hai.
// Admin mein jo bhi update karo, yahi data milega.
export const HERO_BANNER_QUERY = `
  query HeroBanner {
    shop {
      heading: metafield(namespace: "custom", key: "hero_heading") {
        value
      }
      subtext: metafield(namespace: "custom", key: "hero_subtext") {
        value
      }
      ctaText: metafield(namespace: "custom", key: "hero_cta_text") {
        value
      }
      ctaLink: metafield(namespace: "custom", key: "hero_cta_link") {
        value
      }
      image: metafield(namespace: "custom", key: "hero_image") {
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`
