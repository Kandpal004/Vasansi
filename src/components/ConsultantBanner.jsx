// ── Fashion Consultant CTA Banner ──
// Horizontal strip with contact info + Shop Now button

export default function ConsultantBanner() {
  return (
    <section className="bg-[#efd9dd] py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">

        {/* Left — Heading */}
        <h3 className="text-charcoal text-sm lg:text-base tracking-[0.15em] uppercase font-medium text-center lg:text-left">
          Talk to Vasansi's Fashion Consultants
        </h3>

        {/* Middle — Contact info */}
        <div className="text-charcoal/80 text-xs lg:text-sm font-light text-center lg:text-left flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <a href="tel:+919116699595" className="hover:text-charcoal transition-colors">
            Call & WhatsApp at <span className="font-medium">+91-9116699595</span>
          </a>
          <span className="hidden sm:inline text-charcoal/40">or</span>
          <a href="mailto:reachus@vasansi.co.in" className="hover:text-charcoal transition-colors">
            Email at <span className="font-medium">reachus@vasansi.co.in</span>
          </a>
        </div>

        {/* Right — Shop Now button */}
        <a
          href="/collections/shop-all"
          className="inline-block border border-charcoal text-charcoal text-[11px] tracking-[0.25em] uppercase font-medium px-7 py-2.5 hover:bg-charcoal hover:text-white transition-all duration-300 whitespace-nowrap"
        >
          Shop Now
        </a>

      </div>
    </section>
  )
}
