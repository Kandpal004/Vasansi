// ─────────────────────────────────────────────────────────────
//  Razorpay helper
//
//  IMPORTANT — Magic Checkout flow
//  ────────────────────────────────
//  Vasansi ka primary checkout flow Shopify ka `cart.checkoutUrl` use karta hai.
//  Shopify Admin pe Razorpay Magic Checkout app activated hai, isliye jaise hi
//  user us checkoutUrl pe land karta hai, Shopify automatically Magic Checkout
//  ka 1-page UX inject kar deta hai (UPI / Cards / COD / RTO prevention etc.).
//
//  Matlab normal "Buy Now" / "Checkout" button ke liye React mein **koi change
//  nahi chahiye** — Magic Checkout automatically kaam karta hai Shopify side se.
//
//  Ye file sirf tab kaam aati hai jab tum directly Razorpay Standard Checkout
//  (inline modal) open karna chaho — e.g. deposit, custom order, tip jar etc.
//  Direct Razorpay ke liye backend chahiye jo Orders API se `order_id` create kare.
// ─────────────────────────────────────────────────────────────

export function isRazorpayReady() {
  return typeof window !== 'undefined' && !!window.Razorpay
}

/**
 * Open Razorpay Standard Checkout modal inline.
 *
 * @param {object} params
 * @param {number} params.amount       — amount in rupees (will be converted to paise)
 * @param {string} [params.currency]   — default 'INR'
 * @param {string} [params.orderId]    — Razorpay Orders API se banaya order_id (recommended)
 * @param {string} [params.name]       — merchant name shown in modal
 * @param {string} [params.description]
 * @param {string} [params.email]
 * @param {string} [params.contact]
 * @param {(resp:any)=>void} [params.onSuccess]  — successful payment callback
 * @param {()=>void}        [params.onDismiss]   — user closes modal
 * @returns {boolean}                    — true agar modal open ho gaya
 */
export function openRazorpayCheckout({
  amount,
  currency = 'INR',
  orderId,
  name = 'Vasansi Jaipur',
  description,
  email,
  contact,
  onSuccess,
  onDismiss,
}) {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID

  if (!isRazorpayReady()) {
    console.warn('[Razorpay] SDK not loaded yet')
    return false
  }
  if (!keyId) {
    console.warn('[Razorpay] VITE_RAZORPAY_KEY_ID not set in .env — cannot open checkout')
    return false
  }
  if (!amount || amount <= 0) {
    console.warn('[Razorpay] invalid amount')
    return false
  }

  const options = {
    key: keyId,
    amount: Math.round(Number(amount) * 100), // paise
    currency,
    name,
    description,
    order_id: orderId,                         // optional but recommended
    prefill: {
      email: email || '',
      contact: contact || '',
    },
    theme: {
      color: '#AC7783',
    },
    handler: (response) => {
      // response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      onSuccess?.(response)
    },
    modal: {
      ondismiss: () => onDismiss?.(),
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
  return true
}
