// Single data layer for the whole site – everything comes from the CMS, nothing is dummy.
// All calls go through our serverless function (api/cms.js), which holds the CMS API key,
// so neither the key nor the coupon list is ever sent to the browser.
import axios from 'axios'
import { useEffect, useState } from 'react'

const http = axios.create({
  baseURL: '/api/cms',
  timeout: 60000, // free Render instances can take a while to wake up
})

const slugify = (s = '') => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const label = (k) => `${k[0].toUpperCase()}${k.slice(1)}`.replace(/_/g, ' ')

// Values may be nested or lists, e.g. { earring: '10 g', necklace: '26 g' } -> "Earring: 10 g, Necklace: 26 g"
const flatten = (v) =>
  Array.isArray(v)
    ? v.map(flatten).join(', ')
    : v && typeof v === 'object'
      ? Object.entries(v).map(([k, x]) => `${label(k)}: ${flatten(x)}`).join(', ')
      : String(v ?? '')

// CMS record -> the product shape used by every component
const toProduct = (r) => {
  const d = r.data
  const price = Number(d.price) || 0
  const discount = Number(d.discountprice) || 0
  const onSale = discount > 0 && discount < price
  return {
    id: r.recordId,
    slug: r.recordId,
    name: d.productname,
    category: slugify(d.category),
    categoryName: d.category,
    subcategory: d.subcategory,
    subSlug: slugify(d.subcategory),
    price,
    salePrice: onSale ? discount : null,
    images: [...(r.media ?? []).map((m) => m.url), d.image2, d.image3].filter(Boolean),
    features: Object.fromEntries(Object.entries(d.descriptiontext ?? {}).map(([k, v]) => [k, flatten(v)])),
    description: d.description,
    tags: [d.favourites && 'bestseller', onSale && 'sale'].filter(Boolean),
    createdAt: r.createdAt,
    inStock: d.instock !== false,
  }
}

const toReview = (r) => ({
  id: r.recordId,
  productId: r.data.productid,
  productName: r.data.productname,
  name: r.data.reviewername,
  rating: Number(r.data.starrating) || 0,
  text: r.data.comment,
  createdAt: r.createdAt,
})

const list = (resource) => http.get('', { params: { resource } }).then((res) => res.data.data ?? [])

// Fetch the product list once and reuse it everywhere (filtering is done client side).
// The copy is refreshed after a minute so new CMS changes (e.g. added images) show up without a reload.
const CACHE_MS = 60 * 1000
let productsCache
let cachedAt = 0
const allProducts = () => {
  if (!productsCache || Date.now() - cachedAt > CACHE_MS) {
    cachedAt = Date.now()
    productsCache = list('ecommerce')
      .then((rows) => rows.map(toProduct).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      .catch((err) => {
        productsCache = undefined
        throw err
      })
  }
  return productsCache
}

export const api = {
  // Hero slides are the latest products
  getBanners: () =>
    allProducts().then((items) =>
      items.slice(0, 3).map((p) => ({
        id: p.id,
        eyebrow: [p.categoryName, p.subcategory].filter(Boolean).join(' · '),
        title: p.name,
        price: p.salePrice ?? p.price,
        mrp: p.salePrice ? p.price : null,
        image: p.images[0],
        cta: { label: 'Shop Now', to: `/product/${p.slug}` },
      })),
    ),

  // Unique categories (with their subcategories) from the products, using the first product image as the cover
  getCategories: () =>
    allProducts().then((items) => {
      const map = new Map()
      items.forEach((p) => {
        if (!map.has(p.category)) map.set(p.category, { id: p.category, slug: p.category, name: p.categoryName, image: p.images[0], subcategories: [] })
        const subs = map.get(p.category).subcategories
        if (p.subcategory && !subs.some((s) => s.slug === p.subSlug)) subs.push({ slug: p.subSlug, name: p.subcategory })
      })
      return [...map.values()]
    }),

  // filters: { category, sub, tag, q } – tag 'new' means newest first (all products)
  getProducts: ({ category, sub, tag, q } = {}) =>
    allProducts().then((items) =>
      items.filter(
        (p) =>
          (!category || p.category === category) &&
          (!sub || p.subSlug === sub) &&
          (!tag || tag === 'new' || p.tags.includes(tag)) &&
          (!q || `${p.name} ${p.categoryName} ${p.subcategory}`.toLowerCase().includes(q.toLowerCase())),
      ),
    ),

  getProduct: (id) => allProducts().then((items) => items.find((p) => p.slug === id) ?? null),

  // productId optional – without it returns every review
  getReviews: (productId) =>
    list('review').then((rows) => rows.map(toReview).filter((r) => !productId || r.productId === productId)),

  // Returns { code, amount } or null when the code doesn't exist
  // Checked on the server – only the result for this one code comes back, never the coupon list
  checkCoupon: (code) =>
    http.get('', { params: { resource: 'coupon', code } }).then((res) => (res.data.valid ? { code: res.data.code, amount: res.data.amount } : null)),

  // Fields go at the top level of the body (CMS form submit format)
  // order = { items: [{ id, qty }], coupon, customer } – the server works out prices and the total
  submitOrder: (order) => http.post('', order, { params: { form: 'paymentform' } }).then((res) => res.data),
  // Saves the order, then creates a Razorpay order (BuildFree) for that submission
  // -> { submissionId, total, razorpayOrderId, amount, currency, keyId }
  createPayment: (order) => http.post('', order, { params: { action: 'pay' } }).then((res) => res.data),
  submitReview: (review) => http.post('', review, { params: { form: 'review' } }).then((res) => res.data),
}

// Tiny fetch hook: const { data, loading, error } = useApi(() => api.getProducts({ tag }), [tag])
export function useApi(fetcher, deps = []) {
  const key = JSON.stringify(deps)
  const [state, setState] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    let alive = true
    fetcher()
      .then((data) => alive && setState({ key, data, error: null }))
      .catch((error) => alive && setState({ key, data: null, error }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { data: state.data, loading: state.key !== key, error: state.error }
}

export const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

// Free shipping above ₹999
export const shippingFor = (subtotal) => (subtotal >= 999 || subtotal === 0 ? 0 : 79)
