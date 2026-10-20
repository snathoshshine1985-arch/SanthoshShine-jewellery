import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiAward, FiRefreshCw, FiShield, FiTruck } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'
import marble from '../assets/marble.png'
import { api, formatPrice, useApi } from '../services/api'

const Empty = () => <p className="py-10 text-center text-sm text-ink/50">No data available</p>

function Hero() {
  const { data: featured } = useApi(api.getBanners)
  const { data: categories } = useApi(api.getCategories)
  const [i, setI] = useState(0)
  const total = featured?.length ?? 0

  useEffect(() => {
    if (total < 2) return
    const t = setInterval(() => setI((n) => (n + 1) % total), 5000)
    return () => clearInterval(t)
  }, [total])

  const f = featured?.[i]

  return (
    <section className="relative overflow-hidden" style={{ backgroundImage: `url(${marble})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-ivory/95 via-ivory/85 to-cream/70" />
      {/* soft gold glow + sparkles echoing the logo */}
      <div className="absolute top-1/2 right-[10%] h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-gold-200/40 blur-3xl" />
      <span className="absolute top-16 left-[46%] hidden text-2xl text-gold-400 md:block">✦</span>
      <span className="absolute bottom-20 left-[8%] text-lg text-gold-300">✦</span>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
        <div className="animate-[fadeUp_.7s_ease] text-center md:text-left">
          <p className="inline-flex items-center gap-3 text-xs tracking-[0.35em] text-gold-600 uppercase">
            <span className="h-px w-8 bg-gold-400" /> Santhosh Shine Jewellery
          </p>
          <h1 className="mt-5 text-4xl leading-[1.15] font-bold md:text-6xl">
            <span className="gold-text">Where Tradition</span>
            <br />
            <span className="text-ink">Meets Timeless Shine</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-ink/65 md:mx-0">
            Handcrafted temple, bridal and everyday jewellery in rich antique gold finish – made to make every moment sparkle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link to="/shop" className="gold-btn">Shop Collection <FiArrowRight /></Link>
            <Link to="/shop?tag=new" className="inline-flex items-center rounded-full border border-gold-500 bg-white/60 px-6 py-3 text-sm tracking-wider text-gold-700 uppercase backdrop-blur hover:bg-gold-50">
              New Arrivals
            </Link>
          </div>

          {categories?.length > 0 && (
            <div className="mt-10">
              <p className="text-[11px] tracking-[0.3em] text-ink/40 uppercase">Shop by category</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                {categories.map((c) => (
                  <Link key={c.id} to={`/shop/${c.slug}`} className="rounded-full border border-gold-200 bg-white/70 px-4 py-1.5 text-sm text-ink/75 capitalize transition hover:border-gold-500 hover:text-gold-700">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {f && (
          <div className="relative mx-auto w-full max-w-sm">
            {/* temple-arch frame */}
            <div className="absolute -inset-4 rounded-t-full border border-gold-300/80" />
            <div className="absolute -inset-2 rounded-t-full border border-gold-200/60" />
            <Link to={f.cta.to} className="relative block overflow-hidden rounded-t-full bg-cream shadow-2xl shadow-gold-900/20">
              <img key={f.image} src={f.image} alt={f.title} className="aspect-[3/4] w-full animate-[fadeUp_.6s_ease] object-cover transition duration-700 hover:scale-105" />
            </Link>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl text-gold-500">✦</span>

            {/* floating product card */}
            <Link
              key={f.id}
              to={f.cta.to}
              className="absolute -bottom-6 left-2 flex max-w-[85%] animate-[fadeUp_.6s_ease] items-center gap-4 rounded-2xl border border-gold-100 bg-white/95 p-4 shadow-xl backdrop-blur sm:-left-10"
            >
              <div className="min-w-0">
                <p className="truncate text-[10px] tracking-[0.25em] text-gold-600 uppercase">{f.eyebrow}</p>
                <p className="truncate font-display text-sm font-semibold">{f.title}</p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold text-gold-700">{formatPrice(f.price)}</span>
                  {f.mrp && <span className="ml-2 text-xs text-ink/40 line-through">{formatPrice(f.mrp)}</span>}
                </p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500 text-white"><FiArrowRight /></span>
            </Link>

            {total > 1 && (
              <div className="absolute top-1/2 -right-6 flex -translate-y-1/2 flex-col gap-3 sm:-right-14">
                {featured.map((x, n) => (
                  <button
                    key={x.id}
                    onClick={() => setI(n)}
                    aria-label={`Show ${x.title}`}
                    className={`h-12 w-12 overflow-hidden rounded-full border-2 shadow-md transition ${n === i ? 'scale-110 border-gold-500' : 'border-white opacity-70 hover:opacity-100'}`}
                  >
                    <img src={x.image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function Collections() {
  const { data: categories, loading } = useApi(api.getCategories)
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionTitle eyebrow="Discover" title="Our Collections" />
      {!loading && !categories?.length && <Empty />}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
        {categories?.map((c) => (
          <Link key={c.id} to={`/shop/${c.slug}`} className="group text-center">
            <div className="mx-auto aspect-square overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-gold-300 transition group-hover:ring-gold-500">
              <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            </div>
            <p className="mt-3 text-sm font-medium group-hover:text-gold-600">{c.name}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

const tabs = [
  { tag: 'new', label: 'New Arrivals' },
  { tag: 'bestseller', label: 'Best Sellers' },
  { tag: 'sale', label: 'On Sale' },
]

function ProductTabs() {
  const [tag, setTag] = useState(tabs[0].tag)
  const { data: all, loading } = useApi(() => api.getProducts())
  // Only show tabs that have products in the CMS
  const visibleTabs = tabs.filter((t) => t.tag === 'new' || all?.some((p) => p.tags.includes(t.tag)))
  const products = all?.filter((p) => tag === 'new' || p.tags.includes(tag))

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionTitle eyebrow="Handpicked" title="Shop the Shine" />
      <div className="no-scrollbar mb-8 flex justify-center gap-2 overflow-x-auto">
        {visibleTabs.length > 1 && visibleTabs.map((t) => (
          <button
            key={t.tag}
            onClick={() => setTag(t.tag)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm transition ${t.tag === tag ? 'gold-btn py-2' : 'border border-gold-300 text-gold-700 hover:bg-gold-50'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {loading
          ? Array.from({ length: 8 }, (_, n) => <div key={n} className="aspect-[3/4] animate-pulse rounded-2xl bg-cream" />)
          : products?.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {!loading && !products?.length && <Empty />}
      <div className="mt-10 text-center">
        <Link to={`/shop?tag=${tag}`} className="gold-btn">View All <FiArrowRight /></Link>
      </div>
    </section>
  )
}

function Features() {
  const items = [
    [FiAward, 'Premium Quality', 'Hand-finished antique gold'],
    [FiTruck, 'Free Shipping', 'On orders above ₹999'],
    [FiRefreshCw, 'Easy Exchange', '7-day hassle-free exchange'],
    [FiShield, 'Secure Payment', '100% safe checkout'],
  ]
  return (
    <section className="relative" style={{ backgroundImage: `url(${marble})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-ink/80" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-4">
        {items.map(([Icon, title, text]) => (
          <div key={title} className="text-center text-gold-100">
            <Icon className="mx-auto text-3xl text-gold-300" />
            <h3 className="mt-3 text-sm font-semibold tracking-wider text-gold-200">{title}</h3>
            <p className="mt-1 text-xs text-gold-100/70">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Reviews() {
  const { data: reviews, loading } = useApi(() => api.getReviews())
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionTitle eyebrow="Testimonials" title="Loved by Our Customers" />
      {!loading && !reviews?.length && <Empty />}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reviews?.slice(0, 8).map((r) => (
          <figure key={r.id} className="rounded-2xl border border-gold-100 bg-white/90 p-6 shadow-sm">
            <div className="flex gap-1 text-gold-400">
              {Array.from({ length: 5 }, (_, n) => <FaStar key={n} className={n < r.rating ? '' : 'opacity-25'} />)}
            </div>
            <h3 className="mt-3 font-sans font-semibold">{r.productName}</h3>
            <blockquote className="mt-2 text-sm text-ink/70">“{r.text}”</blockquote>
            <figcaption className="mt-4 text-sm font-medium text-gold-600">— {r.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Collections />
      <ProductTabs />
      <Features />
      <Reviews />
    </>
  )
}
