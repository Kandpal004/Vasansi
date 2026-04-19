import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// ── Build-time Shopify meta injection ─────────────────────────
// Vite bot/crawler ko proper <title>, <meta description>, OG tags de —
// kyunki SPA mein JS-level meta update WhatsApp/Facebook/Google crawlers
// execute nahi karte. Data Shopify se aata hai, hardcode nahi.
function shopifyMetaPlugin(env) {
  const STORE = env.VITE_SHOPIFY_STORE
  const TOKEN = env.VITE_STOREFRONT_TOKEN
  const QUERY = `
    query ShopInfo {
      shop {
        name
        description
        primaryDomain { url }
        brand {
          shortDescription
          coverImage { image { url } }
          logo { image { url } }
        }
      }
    }
  `
  let shop = null

  return {
    name: 'shopify-meta',
    async buildStart() {
      if (!STORE || !TOKEN) return
      try {
        const res = await fetch(`https://${STORE}/api/2025-04/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': TOKEN,
          },
          body: JSON.stringify({ query: QUERY }),
        })
        const data = await res.json()
        shop = data?.data?.shop || null
      } catch {
        shop = null
      }
    },
    transformIndexHtml(html) {
      const name        = shop?.name || 'Vasansi'
      const description = shop?.brand?.shortDescription || shop?.description || ''
      const image       = shop?.brand?.coverImage?.image?.url || shop?.brand?.logo?.image?.url || ''
      const url         = shop?.primaryDomain?.url || 'https://www.vasansi.net'

      const escape = (s) => String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

      const metaBlock = `
    <meta name="description" content="${escape(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escape(name)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:url" content="${escape(url)}" />
    ${image ? `<meta property="og:image" content="${escape(image)}" />` : ''}
    <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />
    <meta name="twitter:title" content="${escape(name)}" />
    <meta name="twitter:description" content="${escape(description)}" />
    ${image ? `<meta name="twitter:image" content="${escape(image)}" />` : ''}
    <link rel="canonical" href="${escape(url)}" />`

      return html
        .replace(/<title>.*?<\/title>/i, `<title>${escape(name)}</title>`)
        .replace('</head>', `${metaBlock}\n  </head>`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      shopifyMetaPlugin(env),
    ],
  }
})
