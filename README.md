# Santhosh Shine Jewellery

React + Vite + Tailwind CSS v4 + react-icons.

```
npm install
npm run dev
```

## Structure
```
src/
  assets/      logo.jpg, marble.png (site background)
  components/  Header, Footer, ProductCard, SectionTitle
  context/     CartContext (cart saved in localStorage)
  pages/       Home, Shop, Product, Cart, Checkout
  services/    api.js – the only place data is fetched
```

## CMS
All data comes from the CMS. Nothing is dummy: if the API has no data, the page shows "No data available".

The browser never talks to the CMS directly. Every call goes through the serverless function
[`api/cms.js`](api/cms.js), which holds the API key. The API key and the coupon list never reach the browser.

| Browser calls | Function calls on the CMS |
|---|---|
| `GET /api/cms?resource=ecommerce` | `GET /ecommerce` (products) |
| `GET /api/cms?resource=review` | `GET /review` |
| `GET /api/cms?resource=coupon&code=X` | `GET /couponcode`, checked on the server. Returns only `{ valid, code, amount }` |
| `POST /api/cms?action=pay` `{ items, coupon, customer }` | `POST /forms/paymentform/submit`, then `POST /api/v1/order` with the submission id |
| `POST /api/cms?form=paymentform` `{ items, coupon, customer }` | `POST /forms/paymentform/submit` |
| `POST /api/cms?form=review` | `POST /forms/review/submit` |

- paymentform fields: Name, email, phone, productId, ProductName, address, city, state, pincode, finalpricenumber (productId, ProductName and finalpricenumber are filled automatically from the order)
- review fields: productid, productname, reviewername, revieweremail, starrating, comment

### Payments (BuildFree + Razorpay)
1. On checkout, the browser sends only product ids, quantities, the coupon code and the delivery details.
2. `api/cms.js` prices the order from the CMS (sale price × qty, coupon checked on the server, then shipping).
3. It **saves the order** in the `paymentform` form first (`finalpricenumber` = that server-calculated total).
4. It then creates the BuildFree order: `recordId` = the saved submission's id, `amount` = the same total in paise.
5. The browser opens Razorpay Checkout with the returned `razorpayOrderId`, `amount`, `currency` and `keyId`.
6. BuildFree updates the payment to PENDING, CAPTURED or FAILED through the Razorpay webhook. Treat that as the
   source of truth, not the browser callback.

Cash on Delivery stops after step 3.

### Env (server-only, no `VITE_` prefix, so never bundled)
```
CMS_API_URL=https://cms-backend-9nkz.onrender.com/api/v1/public/webzspot
CMS_API_KEY=...
```
- **Dev:** `npm run dev` runs `api/cms.js` inside Vite, using `.env`.
- **Production:** deploy to Vercel (`api/` is picked up automatically), and add the two variables under
  Project Settings → Environment Variables.
