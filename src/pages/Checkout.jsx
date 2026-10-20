import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { FiCheckCircle, FiCreditCard, FiLock, FiTag, FiTruck } from 'react-icons/fi'
import SectionTitle from '../components/SectionTitle'
import logo from '../assets/logo.jpg'
import { useCart } from '../context/CartContext'
import { api, formatPrice, shippingFor } from '../services/api'

const fields = [
  { name: 'name', label: 'Full name', autoComplete: 'name', span: 2 },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', pattern: '[0-9+ ]{10,15}' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'address', label: 'Address', autoComplete: 'street-address', span: 2 },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'state', label: 'State', autoComplete: 'address-level1' },
  { name: 'pincode', label: 'Pincode', autoComplete: 'postal-code', pattern: '[0-9]{6}' },
]

const methods = [
  { id: 'online', icon: FiCreditCard, title: 'Pay Online', text: 'UPI, cards, net banking & wallets – secured by Razorpay' },
  { id: 'cod', icon: FiTruck, title: 'Cash on Delivery', text: 'Pay when your order arrives' },
]

// Razorpay Checkout script is loaded only when the customer pays
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

export default function Checkout() {
  const { state } = useLocation()
  const cart = useCart()
  const [method, setMethod] = useState('online')
  const [coupon, setCoupon] = useState(null)
  const [couponMsg, setCouponMsg] = useState('')
  const [status, setStatus] = useState(null)
  const [done, setDone] = useState(null)

  // "Buy it now" passes a single product; otherwise check out the whole cart
  const buyNow = state?.buyNow
  const items = buyNow
    ? [{ id: buyNow.id, slug: buyNow.slug, name: buyNow.name, price: buyNow.salePrice ?? buyNow.price, image: buyNow.images[0], qty: buyNow.qty }]
    : cart.items
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0)
  const discount = Math.min(coupon?.amount ?? 0, subtotal)
  const shipping = shippingFor(subtotal - discount)
  const total = subtotal - discount + shipping

  if (done)
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center">
        <FiCheckCircle className="mx-auto text-5xl text-gold-500" />
        <SectionTitle title="Order Placed!">
          Thank you, {done.name}. Your order of {formatPrice(done.total)} has been received.{' '}
          {done.method === 'online'
            ? 'Your payment is being confirmed with Razorpay – we will contact you once it is verified.'
            : 'Please keep cash ready at delivery.'}
        </SectionTitle>
        {done.paymentId && <p className="mb-6 text-xs text-ink/50">Payment ID: {done.paymentId}</p>}
        <Link to="/shop" className="gold-btn">Continue Shopping</Link>
      </section>
    )

  if (!items.length) return <Navigate to="/cart" replace />

  const applyCoupon = async (e) => {
    e.preventDefault()
    const code = new FormData(e.currentTarget).get('coupon')
    if (!code) return
    setCouponMsg('Checking…')
    try {
      const hit = await api.checkCoupon(code)
      setCoupon(hit)
      setCouponMsg(hit ? `${hit.code} applied – you save ${formatPrice(hit.amount)}` : 'Invalid coupon code')
    } catch {
      setCouponMsg('Could not check the coupon. Please try again.')
    }
  }

  const placeOrder = async (e) => {
    e.preventDefault()
    const customer = Object.fromEntries(new FormData(e.currentTarget))
    // Only ids and quantities are sent – the server prices the order from the CMS
    const order = { items: items.map((i) => ({ id: i.id, qty: i.qty })), coupon: coupon?.code ?? '', customer }
    const finish = (extra) => {
      if (!buyNow) cart.clear()
      setDone({ name: customer.name, method, ...extra })
      window.scrollTo(0, 0)
    }
    const fail = (err) => setStatus(err?.response?.data?.message ?? err?.message ?? 'Could not place the order. Please try again.')

    setStatus('sending')
    try {
      if (method === 'cod') {
        const saved = await api.submitOrder(order)
        return finish({ total: saved.total })
      }

      const [ready, pay] = await Promise.all([loadRazorpay(), api.createPayment(order)])
      if (!ready) throw new Error('Could not load the payment window. Please check your connection.')

      new window.Razorpay({
        key: pay.keyId,
        order_id: pay.razorpayOrderId,
        amount: pay.amount,
        currency: pay.currency,
        name: 'Santhosh Shine Jewellery',
        description: items.map((i) => i.name).join(', '),
        image: logo,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        theme: { color: '#b8862b' },
        // The order is already saved (createPayment submits it first). This callback is not proof of
        // payment on its own – BuildFree confirms it through the Razorpay webhook.
        handler: (resp) => finish({ total: pay.total, paymentId: resp.razorpay_payment_id }),
        modal: { ondismiss: () => setStatus('Payment was not completed. You can try again.') },
      }).open()
    } catch (err) {
      fail(err)
    }
  }

  const input = 'w-full rounded-xl border border-gold-200 bg-white px-4 py-3 text-sm outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200'

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle title="Checkout" />
      <div className="grid gap-8 lg:grid-cols-3">
        <form id="checkout" onSubmit={placeOrder} className="space-y-8 lg:col-span-2">
          <fieldset className="rounded-2xl border border-gold-100 bg-white/90 p-6 shadow-sm">
            <legend className="px-2 font-display text-lg text-gold-700">Shipping Details</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(({ name, label, span, ...rest }) => (
                <label key={name} className={span === 2 ? 'sm:col-span-2' : ''}>
                  <span className="mb-1 block text-xs text-ink/60">{label} *</span>
                  <input name={name} required className={input} {...rest} />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-gold-100 bg-white/90 p-6 shadow-sm">
            <legend className="px-2 font-display text-lg text-gold-700">Payment</legend>
            <div className="space-y-3">
              {methods.map(({ id, icon: Icon, title, text }) => (
                <label key={id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${method === id ? 'border-gold-500 bg-gold-50' : 'border-gold-100'}`}>
                  <input type="radio" name="method" value={id} checked={method === id} onChange={() => setMethod(id)} className="accent-gold-600" />
                  <Icon className="text-xl text-gold-600" />
                  <span>
                    <span className="block text-sm font-medium">{title}</span>
                    <span className="text-xs text-ink/60">{text}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <aside className="h-fit rounded-2xl border border-gold-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg">Order Summary</h3>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex gap-3 text-sm">
                <img src={i.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <span className="flex-1">{i.name} <span className="text-ink/50">× {i.qty}</span></span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          <form onSubmit={applyCoupon} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <FiTag className="absolute top-1/2 left-3 -translate-y-1/2 text-gold-500" />
              <input name="coupon" placeholder="Coupon code" className={`${input} py-2 pl-9 uppercase`} />
            </div>
            <button className="rounded-xl border border-gold-400 px-4 text-sm text-gold-700 hover:bg-gold-50">Apply</button>
          </form>
          {couponMsg && <p className={`mt-1 text-xs ${coupon ? 'text-green-700' : 'text-ink/60'}`}>{couponMsg}</p>}

          <dl className="mt-4 space-y-2 border-t border-gold-100 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-green-700"><dt>Coupon ({coupon.code})</dt><dd>− {formatPrice(discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping ? formatPrice(shipping) : 'Free'}</dd></div>
            <div className="flex justify-between border-t border-gold-100 pt-3 text-base font-semibold"><dt>Total</dt><dd className="text-gold-700">{formatPrice(total)}</dd></div>
          </dl>
          <button form="checkout" disabled={status === 'sending'} className="gold-btn mt-6 w-full disabled:opacity-60">
            {status === 'sending' ? 'Please wait…' : method === 'online' ? `Pay ${formatPrice(total)}` : 'Place Order'}
          </button>
          {status && status !== 'sending' && <p className="mt-2 text-center text-sm text-red-600">{status}</p>}
          <p className="mt-3 flex items-center justify-center gap-1 text-xs text-ink/50"><FiLock /> Your details are only used for delivery</p>
        </aside>
      </div>
    </section>
  )
}
