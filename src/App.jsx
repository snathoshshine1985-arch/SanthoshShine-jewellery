import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Policies from './pages/Policies'
import LandingPage from './pages/LandingPage'
import { CartProvider } from './context/CartContext'
import marble from './assets/marble.png'
import { div } from 'framer-motion/client'

// The landing page has its own header and footer, so the shop ones are hidden there
function ShopOnly({ children }) {
  const { pathname } = useLocation()
  return pathname === '/landingpage' ? null : children
}

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
        {/* <ShopOnly><Header /></ShopOnly> */}
        <main className="min-h-[60vh]">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<LandingPage  />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/landingpage" element={<LandingPage />} />
            {/* <Route path="*" element={<Home />} /> */}
            <Route path="*" element={<LandingPage  />} />
          </Routes>
        </main>
        {/* <ShopOnly><Footer /></ShopOnly> */}
      </BrowserRouter>
    </CartProvider>
  )
}
