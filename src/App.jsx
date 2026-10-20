import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { CartProvider } from './context/CartContext'
import marble from './assets/marble.png'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])
  return null
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        {/* Site-wide marble background, softened so content stays readable */}
        <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${marble})` }}>
          <div className="absolute inset-0 bg-ivory/85" />
        </div>
        <Header />
        <main className="min-h-[60vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  )
}
