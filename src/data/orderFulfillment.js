export const fulfillmentStatuses = [
  { id: 'all', label: 'Semua Pesanan' },
  { id: 'pending', label: 'Menunggu Konfirmasi' },
  { id: 'baking', label: 'Sedang Dipanggang' },
  { id: 'packing', label: 'QC & Packing' },
  { id: 'shipping', label: 'Sedang Dikirim' },
]

export const fulfillmentLabels = {
  pending: 'Menunggu Konfirmasi',
  baking: 'Sedang Dipanggang',
  packing: 'QC & Packing',
  shipping: 'Sedang Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

export const nextFulfillment = {
  pending: { status: 'baking', label: 'Ubah Status: Mulai Dipanggang' },
  baking: { status: 'packing', label: 'Ubah Status: Siap Packing (QC Box)' },
  packing: { status: 'shipping', label: 'Ubah Status: Sedang Dikirim' },
  shipping: { status: 'completed', label: 'Ubah Status: Selesai Diterima' },
}

export function fulfillmentOf(order) {
  if (['shipping', 'completed', 'cancelled'].includes(order.status))
    return order.status
  if (['pending', 'baking', 'packing'].includes(order.fulfillmentStatus))
    return order.fulfillmentStatus
  return order.paymentStatus === 'Lunas' ? 'baking' : 'pending'
}

export function extendOrder(order) {
  return {
    ...order,
    fulfillmentStatus: fulfillmentOf(order),
    deliveryMethod: order.deliveryMethod || 'Belum ditentukan',
    deliveryNote: order.deliveryNote || '',
  }
}

export const orderKey = (order) =>
  JSON.stringify([order.source, order.ownerEmail || '', order.id])
export const customerName = (order) =>
  order.recipient?.name ||
  (order.source === 'sample'
    ? 'Pelanggan Demo'
    : order.ownerEmail || 'Nama belum tersedia')
export const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
export const orderTime = (timestamp) =>
  `${new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(timestamp)).replace('.', ':')} WIB`
