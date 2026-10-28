import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiAward, FiRefreshCw, FiShield, FiTruck } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'
import marble from '../assets/marble.png'
import necklace1 from '../assets/hero/necklace-1.webp'
import necklace2 from '../assets/hero/necklace-2.webp'
import necklace3 from '../assets/hero/necklace-3.webp'
import necklace4 from '../assets/hero/necklace-4.webp'
import { api, useApi } from '../services/api'

const Empty = () => <p className="py-10 text-center text-sm text-ink/50">No data available</p>

const heroImages = [
  { src: necklace1, alt: 'Kemp stone dancer necklace on a bust' },
  { src: necklace2, alt: 'Gold filigree necklace' },
  { src: necklace3, alt: 'Floral gold necklace' },
  { src: necklace4, alt: 'Pearl and leaf necklace with earrings' },
]

function Hero() {
  const { data: categories, loading: catLoading } = useApi(api.getCategories)
  const [i, setI] = useState(0)
  const total = heroImages.length

  useEffect(() => {
    if (total < 2) return
    const t = setInterval(() => setI((n) => (n + 1) % total), 5000)
    return () => clearInterval(t)
  }, [total])

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

          {catLoading ? (
            <div className="mt-10" aria-hidden="true">
              <div className="skeleton mx-auto h-3 w-32 rounded md:mx-0" />
              <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                {[96, 80, 112].map((w) => <div key={w} className="skeleton h-8 rounded-full" style={{ width: w }} />)}
              </div>
            </div>
          ) 
          : categories?.length > 0 && (
            <div className="mt-10">
              {/* <p className="text-[11px] tracking-[0.3em] text-ink/40 uppercase">Shop by category</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                {categories.map((c) => (
                  <Link key={c.id} to={`/shop/${c.slug}`} className="rounded-full border border-gold-200 bg-white/70 px-4 py-1.5 text-sm text-ink/75 capitalize transition hover:border-gold-500 hover:text-gold-700">
                    {c.name}
                  </Link>
                ))}
              </div> */}
            </div>
          )
          }
        </div>

        {/* Necklace showcase – temple-arch frame with the transparent necklaces fitted inside, crossfading */}
        <div className="relative mx-auto mb-8 w-full max-w-sm">
          <div className="absolute -inset-4 rounded-t-full border border-gold-300/80" />
          <div className="absolute -inset-2 rounded-t-full border border-gold-200/60" />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl text-gold-500">✦</span>

          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-gradient-to-b from-white/70 via-ivory/60 to-cream/80 shadow-2xl shadow-gold-900/15">
            {/* image area sits below the arch curve so every necklace fits fully inside the frame */}
            <div className="absolute inset-x-[10%] top-[20%] bottom-[5%]">
              {heroImages.map((img, n) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  fetchPriority={n === 0 ? 'high' : 'low'}
                  className={`absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_22px_rgba(92,62,23,0.25)] transition-all duration-1000 ${
                    n === i ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
            {heroImages.map((img, n) => (
              <button
                key={img.src}
                onClick={() => setI(n)}
                aria-label={`Show ${img.alt}`}
                className={`h-2 rounded-full transition-all ${n === i ? 'w-7 bg-gold-500' : 'w-2 bg-gold-300 hover:bg-gold-400'}`}
              />
            ))}
          </div>
        </div>
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
        {loading &&
          Array.from({ length: 6 }, (_, n) => (
            <div key={n} aria-hidden="true">
              <div className="skeleton mx-auto aspect-square rounded-full border-4 border-white shadow-lg" />
              <div className="skeleton mx-auto mt-3 h-4 w-2/3 rounded" />
            </div>
          ))}
        {!loading && categories?.map((c) => (
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
          ? Array.from({ length: 8 }, (_, n) => <ProductCardSkeleton key={n} />)
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
        {loading &&
          Array.from({ length: 4 }, (_, n) => (
            <div key={n} className="space-y-3 rounded-2xl border border-gold-100 bg-white/90 p-6 shadow-sm" aria-hidden="true">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-5/6 rounded" />
              <div className="skeleton mt-4 h-4 w-1/3 rounded" />
            </div>
          ))}
        {!loading && reviews?.slice(0, 8).map((r) => (
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
