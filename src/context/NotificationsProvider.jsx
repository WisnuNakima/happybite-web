import { useEffect, useRef, useState } from 'react'
import { useAuth } from './authContext'
import { NotificationsContext } from './notificationsContext'
import {
  NOTIFICATIONS_KEY,
  orderNotification,
  readNotifications,
} from '@/data/notifications'
import { ORDERS_KEY, readStoredOrders } from '@/data/orders'

function initialNotifications() {
  const notifications = readNotifications()
  // Recover existing checkout orders; illustrative sample orders never alert users.
  try {
    for (const order of readStoredOrders() || []) {
      if (order.source !== 'checkout') continue
      const item = orderNotification(order)
      if (
        !notifications.some(
          (saved) =>
            saved.id === item.id && saved.ownerEmail === item.ownerEmail,
        )
      )
        notifications.push(item)
    }
  } catch {
    /* Notifications still work if order storage is unavailable. */
  }
  return notifications
}

export default function NotificationsProvider({ children }) {
  const { user } = useAuth()
  const ownerEmail = user?.email.trim().toLowerCase()
  const [allNotifications, setAllNotifications] = useState(initialNotifications)
  const current = useRef(allNotifications)

  useEffect(() => {
    function sync(event) {
      if (
        event.key !== NOTIFICATIONS_KEY &&
        event.key !== ORDERS_KEY &&
        event.key !== null
      )
        return
      const next = initialNotifications()
      current.current = next
      setAllNotifications(next)
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  function commit(update) {
    const stored = readNotifications()
    const merged = [
      ...stored,
      ...current.current.filter(
        (item) =>
          !stored.some(
            (saved) =>
              saved.id === item.id && saved.ownerEmail === item.ownerEmail,
          ),
      ),
    ]
    const next = update(merged.filter((item) => item.type === 'status'))
    current.current = next
    setAllNotifications(next)
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next))
    } catch {
      /* Keep in-memory alerts; order persistence is handled separately. */
    }
  }

  function notifyOrder(order) {
    if (order.source !== 'checkout') return
    const item = orderNotification(order)
    commit((items) =>
      items.some(
        (saved) => saved.id === item.id && saved.ownerEmail === item.ownerEmail,
      )
        ? items
        : [item, ...items],
    )
  }

  function markRead(id) {
    commit((items) =>
      items.map((item) =>
        item.ownerEmail === ownerEmail && (id === undefined || item.id === id)
          ? { ...item, read: true }
          : item,
      ),
    )
  }

  const notifications = allNotifications
    .filter(
      (item) =>
        item.type === 'status' && ownerEmail && item.ownerEmail === ownerEmail,
    )
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter((item) => !item.read).length,
        notifyOrder,
        markRead,
        markAllRead: () => markRead(),
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}
