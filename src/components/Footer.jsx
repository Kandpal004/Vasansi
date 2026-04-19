import { useState } from 'react'
import { Link } from 'react-router-dom'

const footerLinks = {
  shop: [
    { name: 'New Arrivals',    to: '/collections/new-arrivals' },
    { name: 'Sarees',          to: '/collections/designer-and-party-wear-sarees' },
    { name: 'Anarkalis',       to: '/collections/gowns-and-anarkali-dresses' },
    { name: 'Lehengas',        to: '/collections/lehengas' },
    { name: 'Fusion Wear',     to: '/collections/fusion-wear' },
    { name: 'Shop All',        to: '/collections/shop-all' },
  ],
  help: [
    { name: 'Contact Us',       to: '/contact' },
    { name: 'Size Guide',       to: '/size-guide' },
    { name: 'Shipping Policy',  to: '/policies/shipping-policy' },
    { name: 'Return & Refund',  to: '/policies/refund-policy' },
    { name: 'Track Your Order', to: '/track-order' },
    { name: 'FAQs',             to: '/faqs' },
  ],
  company: [
    { name: 'About Vasansi',    to: '/pages/about-us' },
    { name: 'Our Story',        to: '/pages/our-story' },
    { name: 'Artisan Stories',  to: '/pages/artisan-stories' },
    { name: 'Blog',             to: '/pages/blog' },
    { name: 'Privacy Policy',   to: '/policies/privacy-policy' },
    { name: 'Terms of Service', to: '/policies/terms-of-service' },
  ],
}

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/vasansi_jaipur', Icon: InstagramIcon },
  { label: 'Facebook',  href: 'https://www.facebook.com/vasansi',         Icon: FacebookIcon  },
]

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

// Accordion section — mobile collapsible, desktop always open
function FooterSection({ title, children, openKey, currentKey, onToggle }) {
  const isOpen = openKey === currentKey

  return (
    <div className="border-b border-white/20 lg:border-0">
      <button
        onClick={() => onToggle(currentKey)}
        className="w-full flex items-center justify-between py-3 lg:py-0 lg:pb-4 lg:cursor-default text-left"
      >
        <h4 className="text-xs tracking-[0.22em] uppercase text-white font-semibold">
          {title}
        </h4>
        <span className="lg:hidden text-white">
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block pb-4 lg:pb-0`}>
        {children}
      </div>
    </div>
  )
}

export default function Footer() {
  const [openSection, setOpenSection] = useState(null)
  const toggle = (key) => setOpenSection(prev => (prev === key ? null : key))

  return (
    <footer className="bg-[#ac7783] text-white font-poppins">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">

          {/* Brand column */}
          <div className="text-left mb-8 lg:mb-0 lg:col-span-4">
            <a href="/" className="inline-block mb-4">
              <img
                src="/vasansi_logo.png"
                alt="Vasansi Jaipur"
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </a>

            {/* Social — Instagram + Facebook only */}
            <div className="flex gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-[#ac7783] transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">

            {/* Shop */}
            <FooterSection title="Shop" currentKey="shop" openKey={openSection} onToggle={toggle}>
              <ul className="space-y-2 pt-1 lg:pt-0 text-left">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-white/90 text-[13px] font-light hover:text-white hover:underline underline-offset-4 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>

            {/* Help */}
            <FooterSection title="Help" currentKey="help" openKey={openSection} onToggle={toggle}>
              <ul className="space-y-2 pt-1 lg:pt-0 text-left">
                {footerLinks.help.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-white/90 text-[13px] font-light hover:text-white hover:underline underline-offset-4 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>

            {/* Contact + Company */}
            <FooterSection title="Contact" currentKey="contact" openKey={openSection} onToggle={toggle}>
              <ul className="space-y-2 pt-1 lg:pt-0 mb-4 text-left">
                <li>
                  <a href="tel:+919116699595" className="text-white/90 text-[13px] font-light hover:text-white transition-colors">
                    +91 91166-99595
                  </a>
                </li>
                <li>
                  <a href="mailto:reachus@vasansi.co.in" className="text-white/90 text-[13px] font-light hover:text-white transition-colors break-all">
                    reachus@vasansi.co.in
                  </a>
                </li>
                <li className="text-white/80 text-[13px] font-light">
                  Mon–Sat: 10am – 7pm IST
                </li>
              </ul>

              <h5 className="text-xs tracking-[0.22em] uppercase text-white font-semibold mb-2">Company</h5>
              <ul className="space-y-2 text-left">
                {footerLinks.company.slice(0, 4).map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-white/90 text-[13px] font-light hover:text-white hover:underline underline-offset-4 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/80 text-[11px] font-light tracking-wide">
            © 2025 Vasansi.com · All rights reserved
          </p>

          <div className="flex items-center gap-2">
            <span className="text-white/80 text-[11px] tracking-wider font-light">We accept:</span>
            {['VISA', 'MC', 'UPI', 'COD'].map((method) => (
              <span
                key={method}
                className="text-white text-[10px] tracking-wider border border-white/50 px-2 py-0.5 font-light"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
