import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'ssj-cart'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable */
    }
  }, [items])

  const value = useMemo(() => {
    const add = (product, qty = 1) =>
      setItems((list) => {
        const found = list.find((i) => i.id === product.id)
        if (found) return list.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
        const { id, slug, name, price, salePrice, images } = product
        return [...list, { id, slug, name, price: salePrice ?? price, image: images[0], qty }]
      })
    const setQty = (id, qty) =>
      setItems((list) => (qty < 1 ? list.filter((i) => i.id !== id) : list.map((i) => (i.id === id ? { ...i, qty } : i))))
    const remove = (id) => setItems((list) => list.filter((i) => i.id !== id))
    const count = items.reduce((n, i) => n + i.qty, 0)
    const total = items.reduce((n, i) => n + i.qty * i.price, 0)
    return { items, add, setQty, remove, count, total, clear: () => setItems([]) }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
