import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import { api, useApi } from '../services/api'

export default function Footer() {
  const { data: categories } = useApi(api.getCategories)

  return (
    <footer className="mt-20 bg-ink text-gold-100/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <img src={logo} alt="Santhosh Shine Jewellery" className="h-20 w-20 rounded-full ring-2 ring-gold-400" />
          <p className="mt-4 text-sm leading-relaxed">
            Handcrafted jewellery that blends tradition with timeless shine. Made with love in Tamil Nadu.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-display text-gold-300">Shop</h4>
          <ul className="space-y-2 text-sm">
            {categories?.length ? (
              categories.map((c) => (
                <li key={c.id}><Link to={`/shop/${c.slug}`} className="hover:text-gold-300">{c.name}</Link></li>
              ))
            ) : (
              <li className="text-gold-100/50">No data available</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-gold-300">Help</h4>
          <ul className="space-y-2 text-sm">
            {['Shipping Policy', 'Returns & Exchange', 'Jewellery Care', 'Terms of Service', 'Privacy Policy'].map((t) => (
              <li key={t}><a href="#" className="hover:text-gold-300">{t}</a></li>
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
