import { useEffect, useRef, useState } from 'react'
import { useAuth } from './authContext'
import { OrdersContext } from './ordersContext'
import { useNotifications } from './notificationsContext'
import {
  ORDERS_KEY,
  createSampleOrders,
  readStoredOrders,
} from '../data/orders'

function initialOrders() {
  try {
    return readStoredOrders() ?? createSampleOrders()
  } catch {
    return createSampleOrders()
  }
}

export default function OrdersProvider({ children }) {
  const { notifyOrder } = useNotifications()
  const { user } = useAuth()
  const ownerEmail = user?.email.trim().toLowerCase()
  const [allOrders, setAllOrders] = useState(initialOrders)
  const current = useRef(allOrders)
  useEffect(() => {
    function sync(event) {
      if (event.key !== ORDERS_KEY && event.key !== null) return
      const next = initialOrders()
      current.current = next
      setAllOrders(next)
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  function commit(update) {
    // Write before clearing the cart; a storage failure leaves checkout intact.
    try {
      const next = update(readStoredOrders() ?? current.current)
      localStorage.setItem(ORDERS_KEY, JSON.stringify(next))
      current.current = next
      setAllOrders(next)
    } catch {
      throw new Error(
        'Pesanan belum tersimpan. Izinkan penyimpanan browser atau kosongkan ruang, lalu coba lagi. Keranjang tetap tersimpan.',
      )
    }
  }

  function addOrder(order) {
    if (!ownerEmail) throw new Error('Silakan masuk untuk menyimpan pesanan.')
    commit((orders) => {
      // Payment-session IDs make repeated confirmations idempotent.
      if (
        orders.some(
          (item) => item.id === order.id && item.ownerEmail === ownerEmail,
        )
      )
        return orders
      return [{ ...order, ownerEmail }, ...orders]
    })
    notifyOrder({ ...order, ownerEmail })
  }

  function updateCourierNote(id, note) {
    commit((orders) =>
      orders.map((order) =>
        order.id === id &&
        (order.source === 'sample' || order.ownerEmail === ownerEmail)
          ? {
              ...order,
              courierNote: note,
              ...(order.recipient && {
                recipient: { ...order.recipient, notes: note },
              }),
            }
          : order,
      ),
    )
  }

  const orders = allOrders
    .filter(
      (order) => order.source === 'sample' || order.ownerEmail === ownerEmail,
    )
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateCourierNote }}>
      {children}
    </OrdersContext.Provider>
  )
}
