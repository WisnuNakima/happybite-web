import { mockOrders } from './orderHistory'
import { orderTotals, selectedOrderItems } from './shopSession'
import { extendOrder } from './orderFulfillment'

export const ORDERS_KEY = 'happybite-orders-v1'

export function readStoredOrders() {
  const raw = localStorage.getItem(ORDERS_KEY)
  let saved
  try {
    saved = JSON.parse(raw)
  } catch {
    return null
  }
  if (!Array.isArray(saved)) return null
  return saved
    .filter(
      (order) =>
        order &&
        typeof order.id === 'string' &&
        ['sample', 'checkout'].includes(order.source) &&
        (order.source === 'sample' || typeof order.ownerEmail === 'string') &&
        Number.isFinite(Date.parse(order.timestamp)) &&
        ['processing', 'shipping', 'completed', 'cancelled'].includes(
          order.status,
        ) &&
        Number.isFinite(order.total) &&
        order.total >= 0 &&
        Number.isFinite(order.shipping) &&
        typeof order.address === 'string' &&
        typeof order.courierNote === 'string' &&
        typeof order.paymentMethod === 'string' &&
        typeof order.paymentStatus === 'string' &&
        Array.isArray(order.items) &&
        order.items.length > 0 &&
        order.items.every(
          (item) =>
            item &&
            typeof item.name === 'string' &&
            typeof item.image === 'string' &&
            Number.isSafeInteger(item.quantity) &&
            item.quantity > 0 &&
            Number.isFinite(item.price) &&
            item.price >= 0,
        ) &&
        (order.status !== 'completed' ||
          Number.isFinite(Date.parse(order.deliveredAt))) &&
        (order.status !== 'shipping' || Array.isArray(order.trackingTimes)),
    )
    .map(extendOrder)
}

export function createSampleOrders(now = Date.now()) {
  // Two clearly marked examples; dates stay useful with the current date filters.
  return [mockOrders[0], mockOrders[2]].map((order, index) => ({
    ...order,
    source: 'sample',
    fulfillmentStatus: order.status,
    deliveryMethod: 'Belum ditentukan',
    timestamp: new Date(now - (index + 1) * 86400000).toISOString(),
    ...(order.deliveredAt && {
      deliveredAt: new Date(
        now - (index + 1) * 86400000 + 3600000,
      ).toISOString(),
    }),
  }))
}

export function createCheckoutOrder({
  id,
  cartItems,
  checkout,
  gift,
  sender,
  products,
}) {
  return {
    id,
    source: 'checkout',
    timestamp: new Date().toISOString(),
    status: 'processing',
    fulfillmentStatus: 'pending',
    deliveryMethod: 'Belum ditentukan',
    deliveryNote: '',
    items: selectedOrderItems(cartItems, products).map(
      ({ id: lineId, product, quantity, variant }) => ({
        id: lineId,
        productId: product.id,
        name: product.name,
        image: product.image,
        description: product.description,
        quantity,
        price: product.price,
        variant,
      }),
    ),
    sectionLabel: 'DAFTAR COOKIE DALAM PAKET',
    greeting: gift.enabled ? gift.message.trim() : '',
    recipient: { ...checkout },
    address: [checkout.address, checkout.city, checkout.postalCode]
      .filter(Boolean)
      .join(', '),
    courierNote: checkout.notes,
    ...orderTotals(cartItems, products),
    paymentMethod: 'QRIS',
    paymentStatus: 'Menunggu verifikasi',
    sender: sender.trim(),
  }
}
