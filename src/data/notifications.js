import { fulfillmentLabels, fulfillmentOf } from './orderFulfillment'

export const NOTIFICATIONS_KEY = 'happybite-notifications-v1'

export function readNotifications() {
  try {
    const saved = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY))
    if (!Array.isArray(saved)) return []
    const notifications = saved.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.ownerEmail === 'string' &&
        item.type === 'status' &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        Number.isFinite(Date.parse(item.timestamp)) &&
        typeof item.read === 'boolean' &&
        (item.linkedOrderId === undefined ||
          typeof item.linkedOrderId === 'string'),
    )
    // Retire unsupported categories from earlier versions of the notification panel.
    if (saved.some((item) => item?.type !== 'status')) {
      try {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
      } catch {
        /* The filtered list still works when storage cannot be updated. */
      }
    }
    return notifications
  } catch {
    return []
  }
}

export function orderNotification(order) {
  const kitchenStage = fulfillmentOf(order)
  const kitchenUpdate = ['baking', 'packing'].includes(kitchenStage)
  const labels = {
    processing: 'Sedang Diproses',
    shipping: 'Sedang Dikirim',
    completed: 'Selesai Diterima',
    cancelled: 'Dibatalkan',
  }
  return {
    id: `order:${order.id}:${kitchenUpdate ? kitchenStage : order.status}`,
    ownerEmail: order.ownerEmail,
    type: 'status',
    title: `Pesanan #${order.id} ${kitchenUpdate ? fulfillmentLabels[kitchenStage] : labels[order.status] || 'Diperbarui'}`,
    description: kitchenUpdate
      ? `Pesananmu kini ${fulfillmentLabels[kitchenStage].toLowerCase()} di dapur HappyBite.`
      : order.status === 'processing'
        ? 'Pesananmu sudah tercatat dan masuk antrean dapur HappyBite. Konfirmasi pembayaran menunggu verifikasi.'
        : 'Status pesananmu telah diperbarui. Lihat rincian pesanan untuk informasi selengkapnya.',
    timestamp: order.updatedAt || order.timestamp,
    read: false,
    linkedOrderId: order.id,
  }
}

export function relativeTime(timestamp, now) {
  const minutes = Math.max(0, Math.floor((now - Date.parse(timestamp)) / 60000))
  if (!minutes) return 'Baru saja'
  if (minutes < 60) return `${minutes} mnt lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}
