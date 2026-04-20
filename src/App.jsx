import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './lib/CartContext'
import { ShopProvider } from './lib/ShopContext'
import { WishlistProvider } from './lib/WishlistContext'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import ProductPage from './pages/ProductPage'
import StaticPage from './pages/StaticPage'
import ContactPage from './pages/ContactPage'
import SizeGuidePage from './pages/SizeGuidePage'
import TrackOrderPage from './pages/TrackOrderPage'
import FAQsPage from './pages/FAQsPage'
import OurStoryPage from './pages/OurStoryPage'
import WishlistPage from './pages/WishlistPage'

export default function App() {
  return (
    <ShopProvider>
    <WishlistProvider>
    <CartProvider>
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Header />
        <CartDrawer />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Product routes — support both Shopify-style URLs so marketing
                / Google / WhatsApp / ad links continue to work:
                  /products/:handle                                 (clean)
                  /collections/:collectionHandle/products/:handle   (Shopify-style) */}
            <Route path="/products/:handle" element={<ProductPage />} />
            <Route path="/collections/:collectionHandle/products/:handle" element={<ProductPage />} />

            {/* Collection listing */}
            <Route path="/collections/:handle" element={<CollectionPage />} />

            {/* Custom premium pages */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Shopify CMS pages + policies */}
            <Route path="/pages/our-story" element={<OurStoryPage />} />
            <Route path="/pages/:handle" element={<StaticPage />} />
            <Route path="/policies/:handle" element={<StaticPage isPolicy />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppWidget />
      </div>
    </CartProvider>
    </WishlistProvider>
    </ShopProvider>
  )
}
