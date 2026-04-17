import { useState } from 'react'

export default function TrackOrderPage() {
  const [orderNum, setOrderNum] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Shopify order status page pattern
    window.open(`https://vasansi-jaipur.myshopify.com/account/orders`, '_blank')
  }

  return (
    <div className="pt-[108px] lg:pt-[108px] pb-16 lg:pb-24 bg-white">

      {/* Hero */}
      <section className="bg-cream py-12 lg:py-20 px-4 sm:px-6 lg:px-8 mb-10 lg:mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-medium mb-3">Order tracking</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-light text-charcoal uppercase tracking-wide">Track Your Order</h1>
          <div className="w-16 h-px bg-charcoal mx-auto mt-6" />
          <p className="text-charcoal text-sm lg:text-base font-light leading-relaxed mt-6 max-w-xl mx-auto">
            Enter your order details below and we'll take you straight to your shipment status.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <form onSubmit={handleSubmit} className="border-2 border-charcoal p-6 lg:p-10 space-y-6">
          <div>
            <label className="block text-[11px] tracking-[0.2em] uppercase text-charcoal font-semibold mb-2">Order Number *</label>
            <input
              type="text" required
              value={orderNum}
              onChange={e => setOrderNum(e.target.value)}
              placeholder="#VSN1234"
              className="w-full border-b-2 border-charcoal text-charcoal text-lg font-light bg-transparent py-2 outline-none focus:border-gold transition-colors placeholder:text-charcoal/40"
            />
          </div>

          <div>
            <label className="block text-[11px] tracking-[0.2em] uppercase text-charcoal font-semibold mb-2">Email / Phone *</label>
            <input
              type="text" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="order@email.com"
              className="w-full border-b-2 border-charcoal text-charcoal text-lg font-light bg-transparent py-2 outline-none focus:border-gold transition-colors placeholder:text-charcoal/40"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-charcoal text-white text-xs tracking-[0.25em] uppercase py-4 font-semibold hover:bg-[#8B5A66] transition-colors"
          >
            Track Order →
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-charcoal font-light">
            Need help? Call us at{' '}
            <a href="tel:+919116699595" className="font-semibold hover:text-gold transition-colors">+91 91166-99595</a>
          </p>
        </div>
      </section>

      {/* Status steps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-semibold mb-2">What to expect</p>
          <h2 className="font-serif text-2xl lg:text-3xl font-light text-charcoal uppercase">Your Order Journey</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
          {[
            { step: '01', title: 'Order Placed', desc: 'Aapka order confirm ho gaya aur payment successfully process ho gaya.' },
            { step: '02', title: 'Crafting', desc: 'Made-to-order items hamare artisans 5-7 days mein handcraft karte hain.' },
            { step: '03', title: 'Dispatched', desc: 'Quality check ke baad order dispatch ho gaya hai tracking ID ke saath.' },
            { step: '04', title: 'Delivered', desc: 'Ready to ship: 3-5 days within India. Made to order: 10-14 days.' },
          ].map(s => (
            <div key={s.step} className="border border-charcoal p-6">
              <p className="text-[10px] tracking-[0.25em] uppercase text-charcoal font-semibold mb-2">Step {s.step}</p>
              <h3 className="font-serif text-lg text-charcoal font-medium mb-2">{s.title}</h3>
              <p className="text-sm text-charcoal font-light leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
