import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'
import { api, useApi } from '../services/api'

const sorters = {
  featured: () => 0,
  'price-asc': (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
  'price-desc': (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
  rating: (a, b) => b.rating - a.rating,
}

export default function Shop() {
  const { category } = useParams()
  const [params] = useSearchParams()
  const tag = params.get('tag') ?? undefined
  const q = params.get('q') ?? undefined
  const sub = params.get('sub') ?? undefined
  const [sort, setSort] = useState('featured')

  const { data: categories } = useApi(api.getCategories)
  const { data: products, loading } = useApi(() => api.getProducts({ category, sub, tag, q }), [category, sub, tag, q])
  const sorted = useMemo(() => [...(products ?? [])].sort(sorters[sort]), [products, sort])

  const cat = categories?.find((c) => c.slug === category)
  const title = q ? `Results for “${q}”` : cat?.subcategories.find((s) => s.slug === sub)?.name ?? cat?.name ?? (tag === 'sale' ? 'Sale' : tag === 'new' ? 'New Arrivals' : tag === 'bestseller' ? 'Best Sellers' : 'All Jewellery')

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionTitle eyebrow="Shop" title={title} />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <Link to="/shop" className={`shrink-0 rounded-full px-4 py-1.5 text-sm ${!category ? 'bg-gold-500 text-white' : 'border border-gold-300 text-gold-700'}`}>All</Link>
          {categories?.map((c) => (
            <Link key={c.id} to={`/shop/${c.slug}`} className={`shrink-0 rounded-full px-4 py-1.5 text-sm ${category === c.slug ? 'bg-gold-500 text-white' : 'border border-gold-300 text-gold-700'}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-gold-300 bg-white px-4 py-2 text-sm outline-none">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {Array.from({ length: 8 }, (_, n) => <div key={n} className="aspect-[3/4] animate-pulse rounded-2xl bg-cream" />)}
        </div>
      ) : sorted.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p className="py-20 text-center text-ink/60">No data available</p>
      )}
    </section>
  )
}
