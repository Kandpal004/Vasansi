import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-10 px-4 sm:px-4 lg:px-4 bg-cream">
      <div className="max-w-2xl mx-auto text-center">

        {/* Gold decorative line */}
        <div className="flex items-center gap-4 justify-center mb-10">
          <div className="h-px w-16 bg-gold/60" />
          <span className="text-gold text-xs">✦</span>
          <div className="h-px w-16 bg-gold/60" />
        </div>

        {/* Heading */}
        <p className="text-xs tracking-[0.3em] uppercase text-charcoal/40 font-light mb-4">
          Stay Connected
        </p>
        <h2 className="font-serif text-3xl lg:text-5xl font-light text-charcoal mb-4">
          Join the Vasansi Family
        </h2>
        <p className="text-charcoal/55 text-sm font-light leading-relaxed mb-10">
          Subscribe to receive exclusive offers, new arrival previews, style inspiration, and members-only discounts.
          No spam, ever.
        </p>

        {/* Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-5 py-4 border border-charcoal/20 bg-white text-charcoal text-sm placeholder-charcoal/35 focus:outline-none focus:border-charcoal transition-colors font-light"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-charcoal text-white text-xs tracking-[0.2em] uppercase font-light hover:bg-burgundy transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        ) : (
          <div className="py-6 text-center">
            <p className="font-serif text-2xl text-charcoal font-light mb-2">Welcome to the family! ✨</p>
            <p className="text-charcoal/50 text-sm font-light">
              Thank you for subscribing. Check your inbox for a welcome gift.
            </p>
          </div>
        )}

        {/* Privacy note */}
        {!submitted && (
          <p className="mt-4 text-charcoal/30 text-xs font-light tracking-wide">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        )}

        {/* Bottom decoration */}
        <div className="flex items-center gap-4 justify-center mt-10">
          <div className="h-px w-16 bg-gold/60" />
          <span className="text-gold text-xs">✦</span>
          <div className="h-px w-16 bg-gold/60" />
        </div>

      </div>
    </section>
  )
}
