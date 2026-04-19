// ─────────────────────────────────────────────────────────────
//  Per-product feature flags — "View Similar" video + Video Call
//
//  Naye SKUs add karne ke liye handle yahan add karo. Har entry me:
//    - videoUrl:        embed-ready video URL (YouTube embed, Vimeo, MP4)
//    - videoCallNumber: WhatsApp number for video call (country code + number, no + / spaces)
//
//  Agar product handle yahan na ho toh buttons dikhenge hi nahi.
// ─────────────────────────────────────────────────────────────

export const PRODUCT_FEATURES = {
  'yellow-kota-silk-gota-patti-saree-vj27022418': {
    // videoUrl blank = placeholder "Video coming soon" modal dikhega
    // Jab actual Vasansi video URL mile (YouTube embed ya MP4), yahan paste karo
    videoUrl: '',
    videoCallNumber: '919893128060',
  },
}

export function getFeaturesFor(handle) {
  if (!handle) return null
  return PRODUCT_FEATURES[handle] || null
}
