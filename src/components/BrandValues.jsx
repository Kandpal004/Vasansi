const values = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    title: 'Handcrafted Quality',
    description: 'Every piece is carefully crafted by skilled artisans using premium fabrics and traditional techniques passed down through generations.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: 'Free Shipping',
    description: 'Enjoy complimentary shipping on all orders above ₹999. Fast and reliable delivery across India via premium courier partners.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    title: 'Easy Returns',
    description: '15-day hassle-free returns. If you\'re not completely satisfied with your purchase, we make the return process simple and quick.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: 'Secure Payments',
    description: 'Shop with confidence using 100% secure payment methods including UPI, net banking, cards, and cash on delivery.',
  },
]

export default function BrandValues() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-charcoal/40 font-light mb-3">
            Our Promise
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-charcoal">
            The Vasansi Difference
          </h2>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {values.map((value) => (
            <div key={value.title} className="text-center group">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-burgundy border border-burgundy/20 rounded-full group-hover:bg-burgundy group-hover:text-white group-hover:border-burgundy transition-all duration-300">
                {value.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-light text-charcoal mb-3">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-charcoal/55 text-sm leading-relaxed font-light">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Thin divider */}
        <div className="mt-20 flex items-center gap-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gold text-xl">✦</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

      </div>
    </section>
  )
}
