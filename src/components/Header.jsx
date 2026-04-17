import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { shopifyFetch, MAIN_MENU_QUERY, toRelativeUrl } from '../lib/shopify'
import { useCart } from '../lib/CartContext'
import SearchDrawer from './SearchDrawer'

// Shopify menu handle — agar tumne naam change kiya hai to yahan update karo
const MENU_HANDLE = 'main-menu'

// Fallback menu — jab tak Shopify ka data nahi aata
const DEFAULT_LINKS = [
  { id: 'd1', title: 'New Arrivals', url: '#', items: [] },
  { id: 'd2', title: 'Sarees',       url: '#', items: [] },
  { id: 'd3', title: 'Anarkalis',    url: '#', items: [] },
  { id: 'd4', title: 'Lehengas',     url: '#', items: [] },
  { id: 'd5', title: 'Fusion Wear',  url: '#', items: [] },
  { id: 'd6', title: 'Sale',         url: '#', items: [], accent: true },
]

const announcements = [
  "TALK TO VASANSI'S FASHION CONSULTANTS",
  "Call & WhatsApp at +91-9116699595",
  "Email at reachus@vasansi.co.in",
  "TALK TO VASANSI'S FASHION CONSULTANTS",
  "Call & WhatsApp at +91-9116699595",
  "Email at reachus@vasansi.co.in",
  "TALK TO VASANSI'S FASHION CONSULTANTS",
  "Call & WhatsApp at +91-9116699595",
  "Email at reachus@vasansi.co.in",
]

// Sale countdown target — yahan se change karo
const SALE_START = new Date('2026-04-21T09:25:00').getTime()

const pad = (n) => String(n).padStart(2, '0')

// Parse Shopify menu items — nested structure ko clean format mein convert karo
function parseMenu(items = []) {
  return items.map(item => ({
    id: item.id,
    title: item.title,
    url: toRelativeUrl(item.url),
    items: (item.items || []).map(sub => ({
      id: sub.id,
      title: sub.title,
      url: toRelativeUrl(sub.url),
    })),
    // "Sale" word detect → accent color
    accent: /sale|offer/i.test(item.title),
  }))
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

export default function Header() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const { totalQuantity, setDrawerOpen } = useCart()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [navLinks, setNavLinks] = useState(DEFAULT_LINKS)
  const [openMobileSub, setOpenMobileSub] = useState(null)
  const [now, setNow] = useState(() => Date.now())
  const [searchOpen, setSearchOpen] = useState(false)

  // Countdown tick — har second update
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, SALE_START - now)
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins  = Math.floor((diff % 3600000) / 60000)
  const secs  = Math.floor((diff % 60000) / 1000)

  // Scroll detection — sirf homepage pe matter karta hai (transparent hero overlay)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Inner pages pe hamesha solid white header (dark hero nahi hai wahan)
  const isSolid = scrolled || !isHomePage

  // Shopify se menu fetch
  useEffect(() => {
    shopifyFetch(MAIN_MENU_QUERY, { handle: MENU_HANDLE })
      .then(data => {
        const items = data?.menu?.items
        if (items?.length) {
          setNavLinks(parseMenu(items))
        }
      })
      .catch(() => {})
  }, [])

  const textColor = isSolid ? 'text-charcoal' : 'text-white'
  const hoverColor = isSolid ? 'hover:text-burgundy' : 'hover:text-gold'

  return (
    <>
      {/* Announcement Bar — always fixed; scroll pe marquee hide */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-[#ac7783] overflow-hidden transition-all duration-300 ${
          isSolid ? 'h-11' : 'h-[72px]'
        }`}
      >
        {/* Countdown strip — hamesha visible */}
        <div className="flex items-center justify-center gap-3 h-11 text-white text-[12px] sm:text-[15px] lg:text-[18px] tracking-[0.18em] uppercase font-light border-b border-white/20">
          <span>Sale Starts In</span>
          <span className="font-medium tracking-wider">
            {pad(days)}d : {pad(hours)}h : {pad(mins)}m : {pad(secs)}s
          </span>
        </div>

        {/* Marquee — scroll pe hide */}
        <div className="animate-marquee py-1.5 bg-black/30">
          {announcements.map((text, i) => (
            <span key={i} className="inline-flex items-center whitespace-nowrap">
              <span className="text-white text-xs tracking-widest uppercase font-light mx-6">{text}</span>
              <span className="text-white text-xs mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
          isSolid ? 'top-11 bg-white shadow-sm' : 'top-[72px] bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Hamburger menu button — ab desktop pe bhi */}
            <button
              className={`${textColor} ${hoverColor} transition-colors`}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/vasansi_logo.png"
                alt="Vasansi Jaipur"
                className={`h-12 lg:h-14 w-auto object-contain transition-all duration-300 ${
                  isSolid ? '' : 'brightness-0 invert'
                }`}
              />
            </Link>

            {/* Desktop nav removed — drawer hi use hoga ab */}

            {/* Icons */}
            <div className={`flex items-center gap-5 ${textColor}`}>
              <button
                onClick={() => setSearchOpen(true)}
                className={`${hoverColor} transition-colors`}
                aria-label="Search"
              >
                <SearchIcon />
              </button>
              <button className={`${hoverColor} transition-colors hidden sm:block`} aria-label="Wishlist">
                <HeartIcon />
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                className={`${hoverColor} transition-colors relative`}
                aria-label="Cart"
              >
                <CartIcon />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Menu Drawer — all screens, smooth slide animation */}
      <div
        className={`fixed inset-0 z-50 ${menuOpen ? '' : 'pointer-events-none'}`}
      >
        {/* Backdrop — fade in/out */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer panel — slide from left */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-80 sm:w-96 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <img src="/vasansi_logo.png" alt="Vasansi Jaipur" className="h-10 w-auto object-contain" />
              </Link>
              <button onClick={() => setMenuOpen(false)} className="text-charcoal hover:text-burgundy transition-colors">
                <CloseIcon />
              </button>
            </div>
            <nav className="flex-1 px-6 py-4 overflow-y-auto">
              {navLinks.map((link) => {
                const hasSub = link.items?.length > 0
                const isOpen = openMobileSub === link.id

                return (
                  <div key={link.id} className="border-b border-gray-50">
                    {/* Main item */}
                    {hasSub ? (
                      <button
                        onClick={() => setOpenMobileSub(isOpen ? null : link.id)}
                        className={`w-full flex items-center justify-between py-4 text-sm tracking-widest uppercase transition-colors
                          ${link.accent ? 'text-burgundy font-medium' : 'text-charcoal hover:text-burgundy'}`}
                      >
                        {link.title}
                        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        to={link.url}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between py-4 text-sm tracking-widest uppercase transition-colors
                          ${link.accent ? 'text-burgundy font-medium' : 'text-charcoal hover:text-burgundy'}`}
                      >
                        {link.title}
                        <span className="text-xs opacity-30">→</span>
                      </Link>
                    )}

                    {/* Sub items */}
                    {hasSub && isOpen && (
                      <div className="pb-3 pl-4">
                        {link.items.map(sub => (
                          <Link
                            key={sub.id}
                            to={sub.url}
                            onClick={() => setMenuOpen(false)}
                            className="block py-2.5 text-xs tracking-wider uppercase text-charcoal hover:text-burgundy transition-colors"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
            <div className="px-6 py-6 border-t border-gray-100">
              <div className="flex gap-4 mb-4">
                <button className="flex items-center gap-2 text-xs tracking-wider text-charcoal hover:text-burgundy transition-colors">
                  <SearchIcon /> Search
                </button>
                <button className="flex items-center gap-2 text-xs tracking-wider text-charcoal hover:text-burgundy transition-colors">
                  <HeartIcon /> Wishlist
                </button>
              </div>
              <p className="text-xs text-gray-400 tracking-wider">📞 91166-99595</p>
            </div>
          </div>
        </div>

        {/* Smart search drawer */}
        <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
