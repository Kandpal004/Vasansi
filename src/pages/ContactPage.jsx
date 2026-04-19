import { useState } from 'react'
import { useMeta } from '../lib/meta'
import { useShop } from '../lib/ShopContext'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const shop = useShop()
  useMeta({
    title: shop?.name ? `Contact — ${shop.name}` : '',
    description: shop?.description || shop?.brand?.shortDescription || '',
    url: shop?.primaryDomain?.url ? `${shop.primaryDomain.url}/contact` : undefined,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = `Name: ${form.name}%0D%0APhone: ${form.phone}%0D%0ASubject: ${form.subject}%0D%0A%0D%0A${form.message}`
    window.location.href = `mailto:reachus@vasansi.co.in?subject=${encodeURIComponent(form.subject || 'Enquiry from Vasansi.com')}&body=${body}`
    setSubmitted(true)
  }

  return (
    <div className="pt-[108px] lg:pt-[108px] pb-16 lg:pb-24 bg-white">

      {/* Hero */}
      <section className="bg-cream py-12 lg:py-20 px-4 sm:px-6 lg:px-8 mb-10 lg:mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] lg:text-xs tracking-[0.35em] uppercase text-charcoal font-medium mb-3">Get in touch</p>
          <h1 className="font-serif text-3xl lg:text-5xl font-light text-charcoal uppercase tracking-wide">Contact Us</h1>
          <div className="w-16 h-px bg-charcoal mx-auto mt-6" />
          <p className="text-charcoal text-sm lg:text-base font-light leading-relaxed mt-6 max-w-xl mx-auto">
            Hamari team aapki assistance ke liye hamesha available hai. Kuch bhi poochhna ho — product, order, ya custom design — humein likhein.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

          {/* Info column */}
          <div className="lg:col-span-2 space-y-8">

            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal font-semibold mb-3">Call & WhatsApp</p>
              <a href="tel:+919116699595" className="font-serif text-2xl lg:text-3xl text-charcoal font-light hover:text-gold transition-colors block">
                +91 91166-99595
              </a>
              <p className="text-charcoal text-xs tracking-wider mt-1 font-light">Mon–Sat · 10am – 7pm IST</p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal font-semibold mb-3">Email</p>
              <a href="mailto:reachus@vasansi.co.in" className="font-serif text-xl lg:text-2xl text-charcoal font-light hover:text-gold transition-colors block break-all">
                reachus@vasansi.co.in
              </a>
              <p className="text-charcoal text-xs tracking-wider mt-1 font-light">We reply within 24 hours</p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal font-semibold mb-3">Studio</p>
              <p className="font-serif text-lg text-charcoal font-light leading-relaxed">
                Vasansi Jaipur<br />
                Jaipur, Rajasthan<br />
                India 302001
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal font-semibold mb-3">Customer care hours</p>
              <ul className="text-charcoal text-sm font-light space-y-1">
                <li className="flex justify-between"><span>Monday – Friday</span><span>10am – 7pm</span></li>
                <li className="flex justify-between"><span>Saturday</span><span>10am – 5pm</span></li>
                <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
              </ul>
            </div>

          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="text-center py-16 border border-charcoal/15">
                <p className="font-serif text-2xl text-charcoal font-light mb-3">Thank you ✨</p>
                <p className="text-sm text-charcoal font-light max-w-md mx-auto">
                  Your message has been prepared in your email client. Hamari team jald hi aapse contact karegi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal font-semibold mb-5">Send us a message</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-charcoal font-medium mb-2">Name *</label>
                    <input
                      type="text" required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border-b-2 border-charcoal text-charcoal text-base font-light bg-transparent py-2 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-charcoal font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full border-b-2 border-charcoal text-charcoal text-base font-light bg-transparent py-2 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-charcoal font-medium mb-2">Email *</label>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border-b-2 border-charcoal text-charcoal text-base font-light bg-transparent py-2 outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-charcoal font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="Product Enquiry / Order / Custom Design…"
                    className="w-full border-b-2 border-charcoal text-charcoal text-base font-light bg-transparent py-2 outline-none focus:border-gold transition-colors placeholder:text-charcoal/40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-charcoal font-medium mb-2">Message *</label>
                  <textarea
                    rows={5} required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full border-2 border-charcoal text-charcoal text-base font-light bg-transparent p-3 outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-charcoal text-white text-xs tracking-[0.25em] uppercase px-10 py-4 font-semibold hover:bg-[#8B5A66] transition-colors"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
