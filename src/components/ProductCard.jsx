import { Link } from 'react-router-dom'
import { FiShoppingBag, FiStar } from 'react-icons/fi'
import logo from '../assets/logo.jpg'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../services/api'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const { slug, name, price, salePrice, images, rating, inStock } = product
  const fallback = (e) => (e.currentTarget.src = logo)

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gold-100 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${slug}`} className="relative aspect-square overflow-hidden bg-cream">
        <img src={images[0]} onError={fallback} alt={name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:opacity-0" />
        <img src={images[1] ?? images[0]} onError={fallback} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100" />
        {salePrice && <span className="absolute top-3 left-3 rounded-full bg-gold-600 px-3 py-1 text-[11px] font-medium tracking-wider text-white">SALE</span>}
        {!inStock && <span className="absolute top-3 right-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] tracking-wider text-white">SOLD OUT</span>}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${slug}`} className="line-clamp-2 text-sm font-medium hover:text-gold-600">{name}</Link>
        {rating && (
          <div className="mt-1 flex items-center gap-1 text-xs text-gold-500">
            <FiStar className="fill-gold-400" /> {rating.toFixed(1)}
          </div>
        )}
        <div className="mt-2 mb-3 flex items-baseline gap-2">
          <span className="font-semibold text-gold-700">{formatPrice(salePrice ?? price)}</span>
          {salePrice && <span className="text-xs text-ink/40 line-through">{formatPrice(price)}</span>}
        </div>
        <button
          disabled={!inStock}
          onClick={() => add(product)}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-full border border-gold-400 py-2 text-xs font-medium tracking-wider text-gold-700 uppercase transition hover:bg-gold-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiShoppingBag /> {inStock ? 'Add to cart' : 'Sold out'}
        </button>
      </div>
    </div>
  )
}

// Same shape as the card, shown while products are loading
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gold-100 bg-white/90 shadow-sm" aria-hidden="true">
      <div className="skeleton aspect-square" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton mt-3 h-5 w-1/3 rounded" />
        <div className="skeleton mt-3 h-8 w-full rounded-full" />
      </div>
    </div>
  )
}
