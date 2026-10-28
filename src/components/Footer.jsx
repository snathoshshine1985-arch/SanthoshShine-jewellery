import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import { api, useApi } from '../services/api'

export default function Footer() {
  const { data: categories, loading } = useApi(api.getCategories)

  return (
    <footer className="mt-20 bg-ink text-gold-100/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-4">
            <img src={logo} alt="" className="h-20 w-20 rounded-full ring-2 ring-gold-400" />
            <div className="leading-tight">
              <p className="font-display text-xl font-semibold tracking-wider text-gold-300">SANTHOSH SHINE</p>
              <p className="font-display text-xs tracking-[0.4em] text-gold-400/80">JEWELLERY</p>
            </div>
          </Link>
          <p className="mt-4 text-sm leading-relaxed">
            Handcrafted jewellery that blends tradition with timeless shine. Made with love in Tamil Nadu.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-display text-gold-300">Shop</h4>
          <ul className="space-y-2 text-sm">
            {loading ? (
              [70, 55, 80, 60].map((w) => (
                <li key={w} aria-hidden="true"><div className="h-3.5 animate-pulse rounded bg-white/10" style={{ width: `${w}%` }} /></li>
              ))
            ) : categories?.length ? (
              categories.map((c) => (
                <li key={c.id}><Link to={`/shop/${c.slug}`} className="capitalize hover:text-gold-300">{c.name}</Link></li>
              ))
            ) : (
              <li className="text-gold-100/50">No data available</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-gold-300">Help</h4>
          <ul className="space-y-2 text-sm">
            {[
              ['shipping', 'Shipping & Delivery'],
              ['refund', 'Cancellation & Refund'],
              ['terms', 'Terms & Conditions'],
              ['privacy', 'Privacy Policy'],
              ['contact', 'Contact Us'],
            ].map(([tab, t]) => (
              <li key={tab}><Link to={`/policies?tab=${tab}`} className="hover:text-gold-300">{t}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} Santhosh Shine Jewellery. All rights reserved.
      </p>
    </footer>
  )
}
