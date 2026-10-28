import { Link, useSearchParams } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import { BUSINESS } from '../data/business'

const UPDATED = '28 October 2026'

// Short and simple: one heading + one line each
const policies = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    sections: [
      { h: 'Data Collection', p: 'We collect only basic details like your name, phone number, email and delivery address.' },
      { h: 'Data Usage', p: 'Your information is used only to process, deliver and update you about your order.' },
      { h: 'Data Security', p: 'We keep your personal information safe and secure. We never sell or share it with others.' },
      // { h: 'Payment Details', p: 'Online payments are handled by a secure payment partner. We do not see or store your card, UPI or bank details.' },
      // { h: 'Your Choice', p: `You can ask us to update or delete your details anytime by writing to ${BUSINESS.email}.` },
    ],
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    sections: [
      { h: 'About Our Products', p: 'Our jewellery is gold-finish fashion jewellery made of copper or brass. It is not real gold or real diamond.' },
      { h: 'Product Look', p: 'Colour and size may look slightly different from the photos because of lighting and screen settings.' },
      { h: 'Order Confirmation', p: 'Your order is confirmed only after successful payment .' },
      { h: 'Order Cancellation by Us', p: 'If a product is out of stock, we may cancel the order and refund the full amount paid.' },
      { h: 'Coupons', p: 'Coupon codes are valid only as stated and cannot be exchanged for cash.' },
      { h: 'Website Use', p: 'Please do not copy our content or images, or place fake orders.' },
    ],
  },
  {
    id: 'refund',
    title: 'Cancellation & Refund',
    sections: [
      { h: 'Order Cancellation', p: 'You can cancel your order before it is dispatched. Once dispatched, it cannot be cancelled.' },
      { h: 'Damaged or Wrong Item', p: 'Contact us within 48 hours of delivery with an unboxing video. We will replace it or give a full refund.' },
      // { h: 'Exchange', p: 'Exchange is available within 7 days of delivery if the item is unused and in its original packing.' },
      { h: 'No Return for Earrings', p: 'Earrings and nose pins cannot be returned or exchanged for hygiene reasons, unless damaged on arrival.' },
      // { h: 'Refund Time', p: 'Approved refunds are sent to your original payment method within 5–7 working days.' },
      { h: 'Payment Issues', p: 'If there is a payment issue, contact us and we will help resolve it.' },
    ],
  },
  // {
  //   id: 'shipping',
  //   title: 'Shipping & Delivery',
  //   sections: [
  //     { h: 'Delivery Area', p: 'We deliver across India. For international orders, please contact us.' },
  //     { h: 'Dispatch', p: 'Orders are dispatched within 2–3 working days.' },
  //     { h: 'Delivery Time', p: 'Delivery usually takes 5–7 working days after dispatch.' },
  //     { h: 'Tracking', p: 'You will get tracking details by SMS, WhatsApp or email once your order is shipped.' },
  //     { h: 'Delays', p: 'Delivery may be delayed due to holidays, weather or courier issues.' },
  //   ],
  // },
  {
    id: 'contact',
    title: 'Contact Us',
    sections: [
      { h: 'Business Name', p: BUSINESS.owner },
      { h: 'Address', p: BUSINESS.address },
      { h: 'Phone', p: BUSINESS.phone },
      { h: 'Email', p: BUSINESS.email },
      { h: 'Support Hours', p: BUSINESS.hours },
    ],
  },
]

export default function Policies() {
  const [params, setParams] = useSearchParams()
  const active = policies.find((p) => p.id === params.get('tab')) ?? policies[0]

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <SectionTitle eyebrow="Policies" title={active.title} />

      <div role="tablist" className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1 sm:justify-center">
        {policies.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={p.id === active.id}
            onClick={() => setParams({ tab: p.id }, { replace: true })}
            className={`shrink-0 rounded-full px-5 py-2 text-sm transition ${
              p.id === active.id ? 'bg-gold-500 text-white shadow' : 'border border-gold-300 bg-white/70 text-gold-700 hover:bg-gold-50'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <article role="tabpanel" className="rounded-2xl border border-gold-100 bg-white/90 p-6 shadow-sm md:p-10">
        {/* <p className="text-xs text-ink/50">Last updated: {UPDATED}</p> */}
        <div className="mt-6 space-y-7">
          {active.sections.map((s) => (
            <div key={s.h}>
              <h2 className="text-lg font-semibold text-gold-700">{s.h}</h2>
              {s.p && <p className="mt-2 leading-relaxed text-ink/75">{s.p}</p>}
              {s.list && (
                <ul className="mt-2 space-y-1.5 text-ink/75">
                  {s.list.map((li) => (
                    <li key={li} className="flex gap-2 leading-relaxed">
                      <span className="mt-1 text-[10px] text-gold-400">✦</span>
                      {li}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-gold-100 pt-5 text-sm text-ink/60">
          Questions? <Link to="/policies?tab=contact" className="text-gold-700 underline underline-offset-2">Contact us</Link>.
        </p>
      </article>
    </section>
  )
}
