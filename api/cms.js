// Vercel serverless function – the only place that talks to the CMS.
// The API key, the coupon list and all pricing stay on the server; the browser only ever
// sends product ids + quantities and gets back the result.
//
//   GET  /api/cms?resource=ecommerce          products
//   GET  /api/cms?resource=review             reviews
//   GET  /api/cms?resource=coupon&code=XYZ    -> { valid, code, amount } (never the list)
//   POST /api/cms?action=pay                  { items, coupon, customer } -> saves the order, then creates the
//                                             Razorpay order (BuildFree /api/v1/order) for that submission
//   POST /api/cms?form=paymentform            { items, coupon, customer } -> saves the order (Cash on Delivery)
//   POST /api/cms?form=review                 review submission

const READABLE = ['ecommerce', 'review'] // collections the browser may read

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const call = async (url, init = {}) => {
  const res = await fetch(url, {
    ...init,
    headers: { 'x-api-key': process.env.CMS_API_KEY, 'Content-Type': 'application/json' },
  })
  return { status: res.status, body: await res.json().catch(() => ({})) }
}
const cms = (path, init) => call(`${process.env.CMS_API_URL}${path}`, init)
// BuildFree Payments API lives on the same backend: <origin>/api/v1/order
const createPaymentOrder = (payload) =>
  call(`${new URL(process.env.CMS_API_URL).origin}/api/v1/order`, { method: 'POST', body: JSON.stringify(payload) })

const findCoupon = async (code) => {
  const wanted = String(code ?? '').trim().toLowerCase()
  if (!wanted) return null
  const { body } = await cms('/couponcode')
  return (body.data ?? []).find((r) => String(r.data?.couponcode ?? '').toLowerCase() === wanted) ?? null
}

// Same rule as the site: free shipping from ₹999 (keep in sync with shippingFor in src/services/api.js)
const shippingFor = (subtotal) => (subtotal >= 999 || subtotal === 0 ? 0 : 79)

// Rebuild the order from CMS data – prices, discount and total never come from the browser
const priceOrder = async ({ items, coupon }) => {
  if (!Array.isArray(items) || !items.length) throw new HttpError(400, 'Your cart is empty')
  const [{ body: products }, hit] = await Promise.all([cms('/ecommerce'), findCoupon(coupon)])

  const lines = items.map(({ id, qty }) => {
    const record = (products.data ?? []).find((p) => p.recordId === id)
    if (!record) throw new HttpError(400, 'A product in your cart is no longer available')
    const price = Number(record.data.price) || 0
    const discount = Number(record.data.discountprice) || 0
    return {
      id,
      name: record.data.productname,
      qty: Math.min(Math.max(parseInt(qty, 10) || 1, 1), 99),
      unit: discount > 0 && discount < price ? discount : price,
    }
  })

  const subtotal = lines.reduce((n, l) => n + l.unit * l.qty, 0)
  const less = Math.min(hit ? Number(hit.data.lessprice) || 0 : 0, subtotal)
  return { lines, total: subtotal - less + shippingFor(subtotal - less) }
}

// Save the order in the "paymentform" form – product id/name and final price are filled in here
const saveOrder = async (order) => {
  const { customer = {} } = order
  const { lines, total } = await priceOrder(order)
  const { status, body } = await cms('/forms/paymentform/submit', {
    method: 'POST',
    body: JSON.stringify({
      Name: customer.name,
      email: customer.email,
      phone: Number(String(customer.phone ?? '').replace(/\D/g, '')),
      productId: lines.map((l) => l.id).join(', '),
      ProductName: lines.map((l) => (l.qty > 1 ? `${l.name} × ${l.qty}` : l.name)).join(', '),
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: Number(customer.pincode),
      finalpricenumber: total,
    }),
  })
  return { status, body, total, lines }
}

// The CMS answers a form submit with { success, message, submissionId }
const submissionIdOf = (body) => body?.submissionId ?? null

export default async function handler(req, res) {
  const { resource, code, form, action } = req.query

  try {
    if (req.method === 'GET' && resource === 'coupon') {
      const hit = await findCoupon(code)
      return res.status(200).json(hit ? { valid: true, code: hit.data.couponcode, amount: Number(hit.data.lessprice) || 0 } : { valid: false })
    }

    if (req.method === 'GET' && READABLE.includes(resource)) {
      const { status, body } = await cms(`/${resource}`)
      return res.status(status).json(body)
    }

    // Online payment: save the order form first, then create the BuildFree/Razorpay order (POST /api/v1/order):
    //   recordId     = the product's record id (first product for a multi-item cart)
    //   submissionId = the saved paymentform submission, so the webhook can update it
    //   amount       = server-calculated total in paise
    if (req.method === 'POST' && action === 'pay') {
      const saved = await saveOrder(req.body ?? {})
      if (saved.status >= 400 || saved.body.success === false)
        return res.status(saved.status >= 400 ? saved.status : 502).json({ success: false, message: saved.body.message ?? 'Could not save the order' })
      const submissionId = submissionIdOf(saved.body)
      if (!submissionId) return res.status(502).json({ success: false, message: 'Order saved, but the CMS did not return its record id' })

      const { status, body } = await createPaymentOrder({ recordId: saved.lines[0].id, submissionId, amount: saved.total * 100, currency: 'INR' })
      if (!body.success) return res.status(status >= 400 ? status : 502).json({ success: false, message: body.message ?? 'Could not start the payment' })
      const { orderId, razorpayOrderId, amount, currency, keyId } = body.data
      return res.status(200).json({ success: true, submissionId, orderId, total: saved.total, razorpayOrderId, amount, currency, keyId })
    }

    // Cash on Delivery: just save the order
    if (req.method === 'POST' && form === 'paymentform') {
      const { status, body, total } = await saveOrder(req.body ?? {})
      return res.status(status).json({ ...body, total })
    }

    if (req.method === 'POST' && form === 'review') {
      const { status, body } = await cms('/forms/review/submit', { method: 'POST', body: JSON.stringify(req.body ?? {}) })
      return res.status(status).json(body)
    }

    return res.status(404).json({ success: false, message: 'Not found' })
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ success: false, message: err.message })
    return res.status(502).json({ success: false, message: 'CMS is not reachable. Please try again.' })
  }
}
