import { useState } from 'react'

const FAQ_SECTIONS = [
  {
    title: 'Orders & Payment',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse our collection, select your size, and add to cart. Proceed to checkout where you can pay via UPI, credit/debit card, net banking, or choose Cash on Delivery.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, Mastercard, American Express, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD) across India.',
      },
      {
        q: 'Is Cash on Delivery available?',
        a: 'Yes, COD is available across India for orders up to ₹25,000. A nominal COD fee of ₹50 applies.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 2 hours of placement. After that, Made-to-Order items go into production and cannot be cancelled.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Ready-to-Ship items: 3–5 business days within India. Made-to-Order items: 10–14 business days. International shipping: 7–14 business days depending on location.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! Free shipping on all orders above ₹999 within India. International shipping is calculated at checkout.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship worldwide. Duties and taxes may apply based on the destination country and are the responsibility of the buyer.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once shipped, you will receive a tracking link via SMS and email. You can also track it from the "Track Your Order" page on our website.',
      },
    ],
  },
  {
    title: 'Returns & Exchange',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 15-day easy return for Ready-to-Ship items. Products must be unworn, unwashed, with original tags and packaging intact. Made-to-Order, customized, and sale items are non-returnable.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Email us at reachus@vasansi.co.in with your order number within 15 days of delivery. Our team will arrange a reverse pickup (service charge may apply based on location).',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 7–10 business days after we receive and inspect the returned item. Refunds are credited to the original payment method.',
      },
      {
        q: 'Can I exchange for a different size?',
        a: 'Yes, size exchanges are offered free of charge for Ready-to-Ship items within 15 days, subject to stock availability.',
      },
    ],
  },
  {
    title: 'Products & Sizing',
    items: [
      {
        q: 'Are the products handcrafted?',
        a: 'Absolutely. Every Vasansi piece is handcrafted by skilled artisans in Jaipur using traditional techniques — mirror work, bandhani, block printing, zardozi, and more.',
      },
      {
        q: 'How do I find my size?',
        a: 'Please refer to our detailed Size Guide for measurements. If your size is not listed, opt for Custom / Made-to-Order at checkout — we tailor the outfit to your measurements.',
      },
      {
        q: 'What is "Made-to-Order"?',
        a: 'Made-to-Order items are stitched especially for you after purchase. They take 10–14 days to produce and are non-returnable, but can be customized in size, sleeve length, and neckline.',
      },
      {
        q: 'How do I care for my outfit?',
        a: 'Most pieces require dry-cleaning only to preserve the embroidery, fabric, and color. Store in a breathable cotton cover away from direct sunlight.',
      },
    ],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b-2 border-charcoal/15 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 lg:py-6 text-left group"
      >
        <span className="text-sm lg:text-base text-charcoal font-medium leading-snug group-hover:text-gold transition-colors">
          {q}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 border-2 border-charcoal flex items-center justify-center transition-all ${open ? 'bg-charcoal text-white rotate-45' : 'text-charcoal'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5 lg:pb-6' : 'max-h-0'}`}>
        <p className="text-charcoal text-sm lg:text-base font-light leading-[1.9] pr-12">{a}</p>
      </div>
    </div>
  )
}

export default function FAQsPage() {
  return (
    <div className="pt-[108px] lg:pt-[108px] pb-16 lg:pb-24 bg-white">

      {/* Hero */}
      <section className="bg-cream py-12 lg:py-20 px-4 sm:px-6 lg:px-8 mb-10 lg:mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-medium mb-3">Got questions?</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-light text-charcoal uppercase tracking-wide">Frequently Asked</h1>
          <div className="w-16 h-px bg-charcoal mx-auto mt-6" />
          <p className="text-charcoal text-sm lg:text-base font-light leading-relaxed mt-6 max-w-xl mx-auto">
            Aapke most common questions ke jawab. Kuch aur poochhna ho toh hum bas ek call / email door hain.
          </p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {FAQ_SECTIONS.map(section => (
          <div key={section.title} className="mb-12 lg:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-serif text-2xl lg:text-3xl font-light text-charcoal uppercase tracking-wide">
                {section.title}
              </h2>
              <div className="flex-1 h-px bg-charcoal/30" />
            </div>
            <div>
              {section.items.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Contact CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center border-2 border-charcoal py-10 lg:py-12">
        <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-semibold mb-3">Still need help?</p>
        <h2 className="font-serif text-2xl lg:text-3xl font-light text-charcoal mb-5">Reach out to us</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="tel:+919116699595" className="text-sm tracking-[0.2em] uppercase border-2 border-charcoal text-charcoal px-6 py-3 hover:bg-charcoal hover:text-white transition-colors font-semibold">
            Call +91 91166-99595
          </a>
          <a href="mailto:reachus@vasansi.co.in" className="text-sm tracking-[0.2em] uppercase bg-charcoal text-white px-6 py-3 hover:bg-[#8B5A66] transition-colors font-semibold">
            Email us
          </a>
        </div>
      </section>

    </div>
  )
}
