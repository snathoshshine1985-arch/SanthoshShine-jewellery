import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { FiAward, FiClock, FiDroplet, FiFeather, FiMail, FiMapPin, FiPackage, FiPhone, FiSun, FiTruck, FiWind } from 'react-icons/fi'
import logo from '../assets/logo.jpg'
import marble from '../assets/marble.png'
import necklace1 from '../assets/hero/necklace-1.webp'
import necklace2 from '../assets/hero/necklace-2.webp'
import necklace3 from '../assets/hero/necklace-3.webp'
import necklace4 from '../assets/hero/necklace-4.webp'
import SectionTitle from '../components/SectionTitle'
import { BUSINESS } from '../data/business'
import { api, useApi } from '../services/api'

// Standalone landing page (/landingpage) – has its own header and footer, separate from the shop layout.

const heroImages = [
  { src: necklace2, alt: 'Gold filigree necklace' },
  { src: necklace4, alt: 'Pearl and leaf necklace with earrings' },
  { src: necklace1, alt: 'Kemp stone dancer necklace on a bust' },
  { src: necklace3, alt: 'Floral gold necklace' },
]

const policyLinks = [
  ['privacy', 'Privacy Policy'],
  ['terms', 'Terms & Conditions'],
  ['refund', 'Cancellation & Refund'],
  ['shipping', 'Shipping & Delivery'],
]

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold-200/60 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-3">
          <img src={logo} alt="Santhosh Shine Jewellery" className="h-12 w-12 rounded-full ring-1 ring-gold-300" />
          <div className="hidden leading-tight whitespace-nowrap sm:block">
            <p className="gold-text font-display text-lg font-bold tracking-wider">SANTHOSH SHINE</p>
            <p className="font-display text-[10px] tracking-[0.4em] text-gold-600">JEWELLERY</p>
          </div>
        </a>
        <nav className="hidden  gap-7 text-sm tracking-wide text-ink/80 lg:flex">
          <a href="#about" className="hover:text-gold-600">About</a>
          <a href="#collections" className="hover:text-gold-600">Collections</a>
          <a href="#testimonials" className="hover:text-gold-600">Testimonials</a>
          <a href="#care" className="hover:text-gold-600">Care</a>
          <a href="#contact" className="hover:text-gold-600">Contact</a>
        </nav>
        {/* <Link to="/shop" className="gold-btn px-5 py-2.5">Shop Now</Link> */}
      </div>
    </header>
  )
}

function Hero() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % heroImages.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="top" className="relative overflow-hidden" style={{ backgroundImage: `url(${marble})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-ivory/95 via-ivory/85 to-cream/70" />
      <div className="absolute top-1/2 right-[10%] h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-gold-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div className="animate-[fadeUp_.7s_ease] text-center md:text-left">
          <p className="inline-flex items-center gap-3 text-xs tracking-[0.35em] text-gold-600 uppercase">
            <span className="h-px w-8 bg-gold-400" /> Santhosh Shine Jewellery
          </p>
          <h1 className="mt-5 text-4xl leading-[1.15] font-bold md:text-6xl">
            <span className="gold-text">Jewellery that</span>
            <br />
            <span className="text-ink">Tells Your Story</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-ink/65 md:mx-0">
            Temple, bridal and everyday pieces in a rich antique gold finish – crafted to make every celebration shine.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            {/* <Link to="/shop" className="gold-btn">Explore Collection <FiArrowRight /></Link> */}
            <a href="#about" className="inline-flex items-center rounded-full border border-gold-500 bg-white/60 px-6 py-3 text-sm tracking-wider text-gold-700 uppercase hover:bg-gold-50">
              Our Story
            </a>
          </div>
        </div>

        {/* temple-arch frame with crossfading necklaces */}
        <div className="relative mx-auto mb-8 w-full max-w-sm">
          <div className="absolute -inset-4 rounded-t-full border border-gold-300/80" />
          <div className="absolute -inset-2 rounded-t-full border border-gold-200/60" />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl text-gold-500">✦</span>
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-gradient-to-b from-white/70 via-ivory/60 to-cream/80 shadow-2xl shadow-gold-900/15">
            <div className="absolute inset-x-[10%] top-[20%] bottom-[5%]">
              {heroImages.map((img, n) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
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

function About() {
  const values = [
    [FiAward, 'Fine Craftsmanship', 'Every piece is hand-finished with care and checked before it ships.'],
    [FiFeather, 'Light & Skin Friendly', 'Copper and brass base with a lasting antique gold finish.'],
    [FiTruck, 'Delivered Across India', 'Dispatched in 2–3 days, free shipping on orders above ₹999.'],
  ]
  return (
    <section id="about" className="scroll-mt-20 mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2">
      <div className="relative mx-auto w-full max-w-md">
        <div className="absolute -inset-3 rounded-[2rem] border border-gold-300/70" />
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white/80 to-cream p-10 shadow-xl">
          <img src={necklace1} alt="Handcrafted kemp necklace" loading="lazy" className="max-h-full object-contain drop-shadow-[0_18px_22px_rgba(92,62,23,0.25)]" />
        </div>
      </div>

      <div>
        <p className="text-xs tracking-[0.35em] text-gold-600 uppercase">About Us</p>
        <h2 className="gold-text mt-3 text-3xl font-semibold md:text-4xl">Crafted with Love in Tamil Nadu</h2>
        <p className="mt-5 leading-relaxed text-ink/70">
          {BUSINESS.name} brings you jewellery inspired by South Indian temple art and timeless bridal traditions. From
          statement harams and chokers to everyday earrings and bangles, each design is made to look rich, feel light and
          stay beautiful for years.
        </p>
        <ul className="mt-8 space-y-5">
          {values.map(([Icon, title, text]) => (
            <li key={title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-100 text-lg text-gold-700"><Icon /></span>
              <span>
                <span className="block font-medium">{title}</span>
                <span className="text-sm text-ink/60">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Collections() {
  const { data: categories, loading } = useApi(api.getCategories)
  return (
    <section id="collections" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-20">
      <SectionTitle eyebrow="Discover" title="Our Collections">
        From grand bridal sets to light everyday pieces – find the perfect shine for every occasion.
      </SectionTitle>
      {!loading && !categories?.length && <p className="py-10 text-center text-sm text-ink/50">No data available</p>}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {loading &&
          Array.from({ length: 6 }, (_, n) => <div key={n} className="skeleton aspect-[4/5] rounded-2xl" aria-hidden="true" />)}
        {!loading &&
          categories?.map((c) => (
            <div key={c.id} className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold-100 bg-cream shadow-sm">
              <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-display text-xl capitalize">{c.name}</p>
                {c.subcategories?.length > 0 && (
                  <p className="mt-1 line-clamp-1 text-xs text-gold-100/80 capitalize">{c.subcategories.map((s) => s.name).join(' · ')}</p>
                )}
                {/* <span className="mt-3 inline-flex items-center gap-1 text-xs tracking-wider text-gold-200 uppercase transition group-hover:gap-2">
                  Shop now <FiArrowRight />
                </span> */}
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}

function Testimonials() {
  const { data: reviews, loading } = useApi(() => api.getReviews())
  return (
    <section id="testimonials" className="scroll-mt-20 relative py-20" style={{ backgroundImage: `url(${marble})`, backgroundSize: 'cover' }}>
      <div className="absolute inset-0 bg-cream/85" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionTitle eyebrow="Testimonials" title="What Our Customers Say" />
        {!loading && !reviews?.length && <p className="py-10 text-center text-sm text-ink/50">No reviews yet</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }, (_, n) => (
              <div key={n} className="space-y-3 rounded-2xl border border-gold-100 bg-white/90 p-7 shadow-sm" aria-hidden="true">
                <div className="skeleton h-4 w-24 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-5/6 rounded" />
                <div className="skeleton mt-4 h-4 w-1/3 rounded" />
              </div>
            ))}
          {!loading &&
            reviews?.slice(0, 6).map((r) => (
              <figure key={r.id} className="relative rounded-2xl border border-gold-100 bg-white/90 p-7 shadow-sm">
                <span className="absolute top-4 right-6 font-display text-6xl leading-none text-gold-200">“</span>
                <div className="flex gap-1 text-gold-400">
                  {Array.from({ length: 5 }, (_, n) => <FaStar key={n} className={n < r.rating ? '' : 'opacity-25'} />)}
                </div>
                <blockquote className="mt-4 leading-relaxed text-ink/75">{r.text}</blockquote>
                <figcaption className="mt-5 border-t border-gold-100 pt-4">
                  <span className="block font-medium text-gold-700">{r.name}</span>
                  {r.productName && <span className="text-xs text-ink/50">on {r.productName}</span>}
                </figcaption>
              </figure>
            ))}
        </div>
      </div>
    </section>
  )
}

function CareGuide() {
  const tips = [
    [FiDroplet, 'Keep It Dry', 'Remove jewellery before bathing, swimming or exercising. Water and sweat dull the gold finish.'],
    [FiWind, 'Perfume First, Jewellery Last', 'Put on perfume, lotion and hairspray first, then wear your jewellery once they have dried.'],
    [FiPackage, 'Store Separately', 'Keep each piece in its pouch or an airtight box so stones stay safe and the finish does not tarnish.'],
    [FiSun, 'Wipe After Wearing', 'Gently clean with a soft dry cloth after every use. Avoid harsh chemicals and polishing liquids.'],
  ]
  return (
    <section id="care" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-20">
      <SectionTitle eyebrow="Jewellery Care" title="Keep Your Jewellery Shining">
        A little care keeps the antique gold finish looking new for years.
      </SectionTitle>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tips.map(([Icon, title, text], n) => (
          <div key={title} className="relative rounded-2xl border border-gold-100 bg-white/90 p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <span className="absolute top-4 left-5 font-display text-sm text-gold-300">0{n + 1}</span>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold-200 bg-gold-50 text-2xl text-gold-600">
              <Icon />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ContactFooter() {
  const contact = [
    [FiMapPin, BUSINESS.address, null],
    [FiPhone, BUSINESS.phone, `tel:${BUSINESS.phone.replace(/[^\d+]/g, '')}`],
    [FiMail, BUSINESS.email, `mailto:${BUSINESS.email}`],
    [FiClock, BUSINESS.hours, null],
  ]
  return (
    <footer id="contact" className="scroll-mt-20 bg-ink text-gold-100/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-4">
            <img src={logo} alt="" className="h-20 w-20 rounded-full ring-2 ring-gold-400" />
            <div className="leading-tight">
              <p className="font-display text-xl font-semibold tracking-wider text-gold-300">SANTHOSH SHINE</p>
              <p className="font-display text-xs tracking-[0.4em] text-gold-400/80">JEWELLERY</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed">Handcrafted jewellery that blends tradition with timeless shine.</p>
          {/* <Link to="/shop" className="gold-btn mt-6">it the Shop <FiArrowRight /></Link> */}
        </div>

        <div>
          <h4 className="mb-5 font-display text-lg text-gold-300">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            {contact.map(([Icon, text, href]) => (
              <li key={text} className="flex gap-3">
                <Icon className="mt-0.5 shrink-0 text-gold-300" />
                {href ? <a href={href} className="hover:text-gold-300">{text}</a> : <span>{text}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 font-display text-lg text-gold-300">Policies</h4>
          <ul className="space-y-3 text-sm">
            {policyLinks.map(([tab, label]) => (
              <li key={tab}><Link to={`/policies?tab=${tab}`} className="hover:text-gold-300">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </p>
    </footer>
  )
}

export default function LandingPage() {
  // smooth scrolling for the in-page links, only while this page is open
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return (
    <>
      <TopBar />
      <Hero />
      <About />
      <Collections />
      <Testimonials />
      <CareGuide />
      <ContactFooter />
    </>
  )
}
