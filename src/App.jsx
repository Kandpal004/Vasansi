import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './lib/CartContext'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import ProductPage from './pages/ProductPage'

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Header />
        <CartDrawer />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections/:handle" element={<CollectionPage />} />
            <Route path="/products/:handle" element={<ProductPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
