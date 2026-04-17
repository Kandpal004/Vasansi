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

function PinterestIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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

// ── Accordion Section — mobile pe collapse hota hai, desktop pe hamesha open ──
function FooterSection({ title, children, openKey, currentKey, onToggle }) {
  const isOpen = openKey === currentKey

  return (
    <div className="border-b border-white/20 lg:border-0">
      {/* Title — mobile pe button (clickable), desktop pe heading */}
      <button
        onClick={() => onToggle(currentKey)}
        className="w-full flex items-center justify-between py-4 lg:py-0 lg:pb-6 lg:cursor-default"
      >
        <h4 className="text-xs tracking-[0.25em] uppercase text-white font-medium">
          {title}
        </h4>
        {/* Chevron sirf mobile pe */}
        <span className="lg:hidden text-white">
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      {/* Content — mobile pe conditional, desktop pe hamesha visible */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block pb-4 lg:pb-0`}>
        {children}
      </div>
    </div>
  )
}

export default function Footer() {
  // Mobile accordion state — ek waqt pe ek section open
  const [openSection, setOpenSection] = useState(null)

  const toggle = (key) => {
    setOpenSection(prev => (prev === key ? null : key))
  }

  return (
    <footer className="bg-[#ac7783] text-white">

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Brand column — hamesha upar mobile pe, desktop pe 1st column */}
        <div className="text-center lg:text-left mb-10 lg:mb-0 lg:grid lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-1 mb-10 lg:mb-0">
            <a href="/" className="inline-block mb-5">
              <img
                src="/vasansi_logo.png"
                alt="Vasansi Jaipur"
                className="h-16 w-auto object-contain brightness-0 invert mx-auto lg:mx-0"
              />
            </a>
            <p className="text-white/80 text-sm font-light leading-relaxed mb-6">
              The art of handcrafted ethnic wear for every occasion. Celebrating Indian craftsmanship, one piece at a time.
            </p>

            {/* Social links */}
            <div className="flex gap-4 justify-center lg:justify-start">
              {[
                { icon: <InstagramIcon />, label: 'Instagram' },
                { icon: <FacebookIcon />, label: 'Facebook' },
                { icon: <PinterestIcon />, label: 'Pinterest' },
                { icon: <YoutubeIcon />, label: 'YouTube' },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 border border-white/40 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <FooterSection title="Shop" currentKey="shop" openKey={openSection} onToggle={toggle}>
            <ul className="space-y-3 pt-2 lg:pt-0">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="text-white/85 text-sm font-light hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Help */}
          <FooterSection title="Help" currentKey="help" openKey={openSection} onToggle={toggle}>
            <ul className="space-y-3 pt-2 lg:pt-0">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="text-white/85 text-sm font-light hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Contact + Company */}
          <FooterSection title="Contact" currentKey="contact" openKey={openSection} onToggle={toggle}>
            <ul className="space-y-3 pt-2 lg:pt-0 mb-6">
              <li>
                <a href="tel:+919116699595" className="text-white/85 text-sm font-light hover:text-white transition-colors">
                  📞 +91 91166-99595
                </a>
              </li>
              <li>
                <a href="mailto:hello@vasansi.com" className="text-white/85 text-sm font-light hover:text-white transition-colors">
                  ✉ hello@vasansi.com
                </a>
              </li>
              <li className="text-white/70 text-sm font-light">
                Mon–Sat: 10am – 7pm IST
              </li>
            </ul>

            <h5 className="text-xs tracking-[0.25em] uppercase text-white font-medium mb-3">Company</h5>
            <ul className="space-y-3">
              {footerLinks.company.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="text-white/85 text-sm font-light hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/70 text-xs font-light tracking-wide">
            © 2025 Vasansi.com · All rights reserved
          </p>

          {/* Payment icons */}
          <div className="flex items-center gap-3">
            <span className="text-white/70 text-xs tracking-wider font-light">We accept:</span>
            {['VISA', 'MC', 'UPI', 'COD'].map((method) => (
              <span
                key={method}
                className="text-white/90 text-[10px] tracking-wider border border-white/40 px-2 py-1 font-light"
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
