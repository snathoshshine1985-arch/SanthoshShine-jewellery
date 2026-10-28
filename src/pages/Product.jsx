import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { FiMinus, FiPlus, FiShoppingBag, FiStar, FiTruck } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'
import { useCart } from '../context/CartContext'
import { api, formatPrice, useApi } from '../services/api'

export default function Product() {
  const { slug } = useParams()
  const { data: product, loading } = useApi(() => api.getProduct(slug), [slug])
  const { data: related } = useApi(() => (product ? api.getProducts({ category: product.category }) : Promise.resolve([])), [product])
  const [reviewKey, setReviewKey] = useState(0)
  const { data: reviews, loading: reviewsLoading } = useApi(() => api.getReviews(slug), [slug, reviewKey])
  const { add } = useCart()
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)

  // Skeleton in the same layout as the page, shown only while the product request is in flight
  if (loading)
    return (
      <section className="mx-auto max-w-7xl px-4 py-10" aria-busy="true" aria-label="Loading product">
        <div className="skeleton mb-6 h-3 w-48 rounded" />
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <div className="skeleton mx-auto aspect-square max-w-2xl rounded-2xl" />
            <div className="mx-auto mt-4 flex max-w-2xl gap-3">
              {[0, 1, 2].map((n) => <div key={n} className="skeleton h-24 w-28 rounded-xl" />)}
            </div>
          </div>
          <div className="max-w-md space-y-4">
            <div className="skeleton h-3 w-40 rounded" />
            <div className="skeleton h-9 w-full rounded" />
            <div className="skeleton h-9 w-2/3 rounded" />
            <div className="skeleton mt-6 h-7 w-1/3 rounded" />
            <div className="skeleton h-3 w-3/5 rounded" />
            <div className="skeleton mt-6 h-12 w-40 rounded-full" />
            <div className="space-y-3 pt-6">
              <div className="skeleton h-12 w-full rounded-full" />
              <div className="skeleton h-12 w-full rounded-full" />
            </div>
            <div className="space-y-3 pt-6">
              {[90, 75, 60, 80].map((w) => <div key={w} className="skeleton h-4 rounded" style={{ width: `${w}%` }} />)}
            </div>
          </div>
        </div>
      </section>
    )
  if (!product)
    return (
      <div className="py-24 text-center">
        <p className="text-ink/60">Product not found.</p>
        <Link to="/shop" className="gold-btn mt-6">Back to shop</Link>
      </div>
    )

  const { name, price, salePrice, images, rating, inStock, description, features } = product

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <nav className="mb-6 text-xs text-ink/50 capitalize">
          <Link to="/" className="hover:text-gold-600">Home</Link> / <Link to={`/shop/${product.category}`} className="hover:text-gold-600">{product.categoryName}</Link>
          {product.subcategory && <> / <Link to={`/shop/${product.category}?sub=${product.subSlug}`} className="hover:text-gold-600">{product.subcategory}</Link></>}
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* Gallery: large image, thumbnails underneath */}
          <div>
            <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-gold-100 bg-cream shadow-lg">
              <img src={images[active]} alt={name} className="aspect-square w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mx-auto mt-4 flex max-w-2xl gap-3 overflow-x-auto no-scrollbar">
                {images.map((src, n) => (
                  <button
                    key={src + n}
                    onClick={() => setActive(n)}
                    aria-label={`Image ${n + 1}`}
                    className={`h-24 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${n === active ? 'border-gold-500' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="max-w-md">
            <p className="text-[11px] tracking-[0.3em] text-gold-600 uppercase">Santhosh Shine Jewellery</p>
            <h1 className="mt-3 text-3xl leading-tight font-medium text-ink md:text-[2.6rem]">{name}</h1>
            {rating && <div className="mt-2 flex items-center gap-1 text-sm text-gold-500"><FiStar className="fill-gold-400" /> {rating.toFixed(1)}</div>}

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-semibold text-gold-700">{formatPrice(salePrice ?? price)}</span>
              {salePrice && (
                <>
                  <span className="text-ink/40 line-through">{formatPrice(price)}</span>
                  <span className="rounded-full bg-gold-100 px-3 py-1 text-xs text-gold-700">Save {Math.round((1 - salePrice / price) * 100)}%</span>
                </>
              )}
            </div>
            <p className="mt-2 text-xs text-ink/55">Tax included. <span className="text-gold-700 underline underline-offset-2">Shipping</span> calculated at checkout.</p>

            <p className="mt-7 text-sm text-ink/70">Quantity</p>
            <div className="mt-2 inline-flex items-center rounded-full border border-gold-300 bg-white/70">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-5 py-3 text-gold-700" aria-label="Decrease"><FiMinus /></button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-5 py-3 text-gold-700" aria-label="Increase"><FiPlus /></button>
            </div>

            <div className="mt-10 space-y-3">
              <button
                disabled={!inStock}
                onClick={() => add(product, qty)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gold-500 bg-white/70 py-3.5 text-sm font-medium tracking-wider text-gold-700 uppercase transition hover:bg-gold-50 disabled:opacity-40"
              >
                <FiShoppingBag /> {inStock ? 'Add to cart' : 'Sold out'}
              </button>
              <button
                disabled={!inStock}
                onClick={() => navigate('/checkout', { state: { buyNow: { ...product, qty } } })}
                className="gold-btn w-full py-3.5 disabled:opacity-40"
              >
                Buy it now
              </button>
            </div>

            {description && <p className="mt-8 leading-relaxed text-ink/70">{description}</p>}
            {Object.keys(features).length > 0 && (
              <ul className="mt-8 space-y-3 text-[15px] text-ink/75">
                {Object.entries(features).map(([k, v]) => (
                  <li key={k}>
                    <span className="capitalize">{k.replace(/_/g, ' ')}</span> : {v}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-8 flex items-center gap-2 border-t border-gold-100 pt-5 text-sm text-ink/60"><FiTruck className="text-gold-500" /> Dispatched within 2–3 business days</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionTitle eyebrow="Reviews" title="Customer Reviews" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {reviewsLoading ? (
              [0, 1].map((n) => (
                <div key={n} className="space-y-3 rounded-2xl border border-gold-100 bg-white/90 p-5 shadow-sm" aria-hidden="true">
                  <div className="skeleton h-4 w-24 rounded" />
                  <div className="skeleton h-3 w-5/6 rounded" />
                  <div className="skeleton h-3 w-1/4 rounded" />
                </div>
              ))
            ) : reviews?.length ? (
              reviews.map((r) => (
                <figure key={r.id} className="rounded-2xl border border-gold-100 bg-white/90 p-5 shadow-sm">
                  <div className="flex gap-1 text-gold-400">
                    {Array.from({ length: 5 }, (_, n) => <FaStar key={n} className={n < r.rating ? '' : 'opacity-25'} />)}
                  </div>
                  <blockquote className="mt-2 text-sm text-ink/70">“{r.text}”</blockquote>
                  <figcaption className="mt-3 text-sm font-medium text-gold-600">— {r.name}</figcaption>
                </figure>
              ))
            ) : (
              <p className="py-10 text-center text-sm text-ink/50">No reviews yet</p>
            )}
          </div>
          <ReviewForm product={product} onDone={() => setReviewKey((k) => k + 1)} />
        </div>
      </section>

      {related?.length > 1 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <SectionTitle eyebrow="You may also like" title="Related Pieces" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.filter((p) => p.id !== product.id).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  )
}

function ReviewForm({ product, onDone }) {
  const [rating, setRating] = useState(5)
  const [status, setStatus] = useState(null)
  const input = 'w-full rounded-xl border border-gold-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200'

  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      await api.submitReview({
        productid: product.id,
        productname: product.name,
        reviewername: f.reviewername,
        revieweremail: f.revieweremail,
        starrating: String(rating),
        comment: f.comment,
      })
      form.reset()
      setStatus('done')
      onDone()
    } catch (err) {
      setStatus(err.response?.data?.message ?? 'Could not submit review. Please try again.')
    }
  }

  return (
    <form onSubmit={submit} className="h-fit space-y-3 rounded-2xl border border-gold-200 bg-white/90 p-6 shadow-sm">
      <h3 className="text-lg text-gold-700">Write a Review</h3>
      <div className="flex gap-1 text-xl text-gold-400">
        {Array.from({ length: 5 }, (_, n) => (
          <button type="button" key={n} onClick={() => setRating(n + 1)} aria-label={`${n + 1} stars`}>
            <FaStar className={n < rating ? '' : 'opacity-25'} />
          </button>
        ))}
      </div>
      <input name="reviewername" required placeholder="Your name *" className={input} />
      <input name="revieweremail" type="email" required placeholder="Email *" className={input} />
      <textarea name="comment" required rows={3} placeholder="Your review *" className={input} />
      <button disabled={status === 'sending'} className="gold-btn w-full disabled:opacity-60">
        {status === 'sending' ? 'Submitting…' : 'Submit Review'}
      </button>
      {status === 'done' && <p className="text-sm text-green-700">Thank you! Your review has been submitted.</p>}
      {status && !['sending', 'done'].includes(status) && <p className="text-sm text-red-600">{status}</p>}
    </form>
  )
}
