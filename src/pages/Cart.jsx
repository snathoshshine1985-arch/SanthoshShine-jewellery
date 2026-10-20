import { Link } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import SectionTitle from '../components/SectionTitle'
import { useCart } from '../context/CartContext'
import { formatPrice, shippingFor } from '../services/api'

export default function Cart() {
  const { items, setQty, remove, total } = useCart()
  const shipping = shippingFor(total)

  if (!items.length)
    return (
      <section className="py-24 text-center">
        <SectionTitle title="Your Cart is Empty">Discover pieces crafted to make you shine.</SectionTitle>
        <Link to="/shop" className="gold-btn">Start Shopping</Link>
      </section>
    )

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle title="Shopping Cart" />
      <div className="grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((i) => (
            <li key={i.id} className="flex gap-4 rounded-2xl border border-gold-100 bg-white/90 p-4 shadow-sm">
              <img src={i.image} alt={i.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <Link to={`/product/${i.slug}`} className="font-medium hover:text-gold-600">{i.name}</Link>
                <span className="text-sm text-gold-700">{formatPrice(i.price)}</span>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-gold-300 text-sm">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="p-2 text-gold-700" aria-label="Decrease"><FiMinus /></button>
                    <span className="w-6 text-center">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="p-2 text-gold-700" aria-label="Increase"><FiPlus /></button>
                  </div>
                  <button onClick={() => remove(i.id)} className="text-ink/40 hover:text-red-600" aria-label="Remove"><FiTrash2 /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-gold-200 bg-white/90 p-6 shadow-sm">
          <h3 className="text-lg">Order Summary</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(total)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping ? formatPrice(shipping) : 'Free'}</dd></div>
            <div className="flex justify-between border-t border-gold-100 pt-3 text-base font-semibold"><dt>Total</dt><dd className="text-gold-700">{formatPrice(total + shipping)}</dd></div>
          </dl>
          <Link to="/checkout" className="gold-btn mt-6 w-full">Proceed to Checkout</Link>
          <Link to="/shop" className="mt-3 block text-center text-sm text-gold-700 hover:underline">Continue shopping</Link>
        </aside>
      </div>
    </section>
  )
}
