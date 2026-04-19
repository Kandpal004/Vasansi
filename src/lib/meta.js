import { useEffect } from 'react'

// Set or update a <meta> tag (name or property) in the document head
function setMetaTag(attr, key, content) {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setLinkTag(rel, href) {
  if (!href) return
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

// useMeta — set page title + description + social preview tags dynamically.
// Sab values Shopify (ya aur data source) se aani chahiye — hardcode content nahi.
export function useMeta({ title, description, image, url, type = 'website' }) {
  useEffect(() => {
    if (title) document.title = title

    if (description) {
      setMetaTag('name', 'description', description)
    }

    // Open Graph
    if (title) setMetaTag('property', 'og:title', title)
    if (description) setMetaTag('property', 'og:description', description)
    if (image) setMetaTag('property', 'og:image', image)
    if (url) setMetaTag('property', 'og:url', url)
    setMetaTag('property', 'og:type', type)

    // Twitter
    setMetaTag('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    if (title) setMetaTag('name', 'twitter:title', title)
    if (description) setMetaTag('name', 'twitter:description', description)
    if (image) setMetaTag('name', 'twitter:image', image)

    // Canonical
    if (url) setLinkTag('canonical', url)
  }, [title, description, image, url, type])
}

// Helper — choose the best field from Shopify's SEO object (falls back gracefully)
export function pickSeo(obj, fallback = {}) {
  const seo = obj?.seo || {}
  return {
    title: seo.title || obj?.title || fallback.title || '',
    description: seo.description || obj?.description || obj?.bodySummary || fallback.description || '',
  }
}
