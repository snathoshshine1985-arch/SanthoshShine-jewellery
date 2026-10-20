import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiChevronDown, FiHeart, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from 'react-icons/fi'
import logo from '../assets/logo.jpg'
import { useCart } from '../context/CartContext'
import { api, useApi } from '../services/api'

export default function Header() {
  const { count } = useCart()
  const { data: categories } = useApi(api.getCategories)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(null) // category whose dropdown is open by click
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop?tag=new', label: 'New Arrivals' },
    ...(categories ?? []).slice(0, 5).map((c) => ({ to: `/shop/${c.slug}`, label: c.name, subs: c.subcategories })),
    { to: '/shop?tag=sale', label: 'Sale' },
  ]

  const onSearch = (e) => {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q')
    setSearch(false)
    navigate(`/shop?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="bg-gold-800 text-gold-100">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs tracking-wide">Free shipping across India on orders above ₹999</p>
      </div>

      {/* Main bar */}
      <div className={`border-b border-gold-200/60 bg-ivory/95 backdrop-blur transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button className="text-2xl text-gold-700 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <FiMenu />
          </button>

          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Santhosh Shine Jewellery" className="h-12 w-12 rounded-full ring-1 ring-gold-300 md:h-14 md:w-14" />
            <div className="hidden leading-tight whitespace-nowrap sm:block">
              <p className="gold-text font-display text-lg font-bold tracking-wider">SANTHOSH SHINE</p>
              <p className="font-display text-[10px] tracking-[0.4em] text-gold-600">JEWELLERY</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
            {links.map((l) => {
              const link = (
                <NavLink
                  to={l.to}
                  end
                  className={({ isActive }) =>
                    `text-sm whitespace-nowrap capitalize tracking-wide transition hover:text-gold-600 ${isActive ? 'text-gold-600 underline underline-offset-8' : 'text-ink/80'}`
                  }
                >
                  {l.label}
                </NavLink>
              )
              if (!l.subs?.length) return <div key={l.to}>{link}</div>
              const shown = menu === l.to
              return (
                <div key={l.to} className="group relative" onMouseLeave={() => setMenu(null)}>
                  <div className="flex items-center gap-1">
                    {link}
                    <button
                      onClick={() => setMenu(shown ? null : l.to)}
                      aria-label={`${l.label} subcategories`}
                      aria-expanded={shown}
                      className="text-gold-600"
                    >
                      <FiChevronDown className={`text-sm transition group-hover:rotate-180 ${shown ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Subcategory dropdown – opens on hover or on chevron click */}
                  <div
                    className={`absolute top-full left-1/2 z-50 -translate-x-1/2 pt-5 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
                      shown ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'
                    }`}
                  >
                    <div className="relative min-w-60 rounded-2xl border border-gold-200 bg-ivory shadow-2xl shadow-gold-900/10">
                      <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-t border-l border-gold-200 bg-gold-50" />
                      <p className="rounded-t-2xl border-b border-gold-100 bg-gold-50 px-5 py-3 text-center font-display text-xs tracking-[0.3em] text-gold-700 uppercase">
                        {l.label}
                      </p>
                      <ul className="py-2">
                        {l.subs.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              to={`${l.to}?sub=${sub.slug}`}
                              onClick={() => setMenu(null)}
                              className="group/item flex items-center gap-3 px-5 py-2.5 text-sm text-ink/80 capitalize transition hover:bg-gold-50 hover:text-gold-700"
                            >
                              <span className="text-[10px] text-gold-300 transition group-hover/item:text-gold-500">✦</span>
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={l.to}
                        onClick={() => setMenu(null)}
                        className="block rounded-b-2xl border-t border-gold-100 px-5 py-3 text-center text-xs tracking-wider text-gold-600 uppercase hover:bg-gold-50"
                      >
                        View all
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>

          <div className="flex items-center gap-4 text-xl text-gold-700">
            <button onClick={() => setSearch((s) => !s)} aria-label="Search"><FiSearch /></button>
            <button className="hidden sm:block" aria-label="Account"><FiUser /></button>
            <button className="hidden sm:block" aria-label="Wishlist"><FiHeart /></button>
            <Link to="/cart" className="relative" aria-label="Cart">
              <FiShoppingBag />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-gold-500 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {search && (
          <form onSubmit={onSearch} className="mx-auto flex max-w-2xl gap-2 px-4 pb-4">
            <input
              name="q"
              autoFocus
              placeholder="Search necklaces, earrings, bangles…"
              className="flex-1 rounded-full border border-gold-300 bg-white px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold-300"
            />
            <button className="gold-btn py-2.5">Search</button>
          </form>
        )}
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <aside className={`absolute inset-y-0 left-0 w-72 bg-ivory p-6 shadow-xl transition-transform ${open ? '' : '-translate-x-full'}`}>
          <div className="mb-6 flex items-center justify-between">
            <img src={logo} alt="" className="h-12 w-12 rounded-full" />
            <button className="text-2xl text-gold-700" onClick={() => setOpen(false)} aria-label="Close menu"><FiX /></button>
          </div>
          <nav className="flex flex-col divide-y divide-gold-100">
            {links.map((l) => (
              <div key={l.to}>
                <div className="flex items-center justify-between">
                  <Link to={l.to} onClick={() => setOpen(false)} className="flex-1 py-3 text-ink/80 capitalize hover:text-gold-600">
                    {l.label}
                  </Link>
                  {l.subs?.length > 0 && (
                    <button onClick={() => setMenu(menu === l.to ? null : l.to)} aria-label={`${l.label} subcategories`} aria-expanded={menu === l.to} className="p-2 text-gold-600">
                      <FiChevronDown className={`transition ${menu === l.to ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {menu === l.to && (
                  <ul className="mb-3 space-y-1 border-l-2 border-gold-200 pl-4">
                    {l.subs.map((sub) => (
                      <li key={sub.slug}>
                        <Link to={`${l.to}?sub=${sub.slug}`} onClick={() => setOpen(false)} className="block py-1.5 text-sm text-ink/70 capitalize hover:text-gold-600">
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </header>
  )
}
