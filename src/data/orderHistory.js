// Source fixtures for the clearly labeled sample orders in OrdersProvider.
export const orderStatuses = [
  { id: 'all', label: 'Semua Pesanan' },
  { id: 'shipping', label: 'Sedang Dikirim' },
  { id: 'processing', label: 'Diproses Dapur' },
  { id: 'completed', label: 'Selesai' },
  { id: 'cancelled', label: 'Dibatalkan' },
]

const red = {
  name: 'Red Velvet Cream Cheese Lava',
  image: '/images/red-velvet.jpg',
  description: 'Premium cocoa dough with warm molten core',
  quantity: 2,
  price: 34000,
}
const classic = {
  name: 'The OG Classic Chocochip Melt',
  image: '/images/classic-chocochip.jpg',
  description: 'Topped with French sea salt crystals',
  quantity: 1,
  price: 28000,
}
const matcha = {
  name: 'Kyoto Matcha White Choc Melt',
  image: '/images/matcha-white-chocolate.jpg',
  description: 'Matcha Uji dengan lelehan white chocolate',
  quantity: 1,
  price: 32000,
}
const dark = {
  name: 'Triple Dark Fudge & Walnut',
  image: '/images/dark-choco-walnut.jpg',
  description: 'Cokelat pekat dengan walnut panggang',
  quantity: 2,
  price: 32000,
}

export const mockOrders = [
  {
    id: 'HB-2025-0842',
    timestamp: '2025-02-14T10:15:00+07:00',
    status: 'shipping',
    trackingStage: 2,
    trackingTimes: [
      '10:20 WIB',
      '10:45 WIB',
      'Saat Ini (Jl. Gatot Subroto)',
      'Est. 11:30',
    ],
    estimatedArrival: '11:30 WIB (Hangat)',
    items: [red, classic],
    sectionLabel: 'DAFTAR COOKIE DALAM PAKET',
    greeting:
      'Selamat ulang tahun Nabila tersayang! Semoga harimu selalu manis dan hangat seperti cookie ini.',
    total: 99800,
    shipping: 3800,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    address: 'Jl. Kemang Raya No. 42B, Jakarta Selatan',
    courierNote: 'Pagar hitam, telepon saat tiba.',
  },
  {
    id: 'HB-2025-0839',
    timestamp: '2025-02-14T08:30:00+07:00',
    status: 'processing',
    items: [
      {
        ...matcha,
        quantity: 2,
        price: 29500,
        description: '2 pcs dalam bundle',
      },
      {
        ...dark,
        name: 'Triple Dark Fudge & Walnut Crunch',
        price: 29500,
        description: '2 pcs dalam bundle',
      },
    ],
    sectionLabel: 'ISI KOTAK CUSTOM (BOX BUNDLE OF 4)',
    total: 133000,
    shipping: 15000,
    paymentMethod: 'BCA VA',
    paymentStatus: 'Lunas',
    address: 'Jl. Senopati No. 42, Jakarta Selatan',
    courierNote: 'Titip satpam bila tidak di tempat.',
  },
  {
    id: 'HB-2025-0791',
    timestamp: '2025-02-08T14:20:00+07:00',
    status: 'completed',
    deliveredAt: '2025-02-08T15:45:00+07:00',
    deliveryNote:
      'Diterima langsung oleh Amanda Putri dalam kondisi hangat & segel utuh.',
    items: [dark, matcha],
    total: 106000,
    shipping: 10000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    address: 'Jakarta Selatan',
    courierNote: '',
  },
  ...[
    ['HB-2025-0765', '2025-02-05', [classic, matcha]],
    ['HB-2025-0718', '2025-02-01', [red]],
    ['HB-2025-0684', '2025-01-27', [dark, classic]],
    ['HB-2025-0612', '2025-01-23', [matcha, classic]],
    ['HB-2025-0540', '2025-01-17', [red, dark]],
  ].map(([id, date, items]) => ({
    id,
    timestamp: `${date}T10:00:00+07:00`,
    status: 'completed',
    deliveredAt: `${date}T11:30:00+07:00`,
    deliveryNote:
      'Pesanan telah diterima dalam kondisi baik. Terima kasih sudah memilih HappyBite!',
    items,
    total:
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 10000,
    shipping: 10000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    address: 'Jakarta Selatan',
    courierNote: '',
  })),
]

export const formatOrderDate = (date) =>
  `${new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(date))} WIB`
export const formatRupiah = (amount) => `Rp ${amount.toLocaleString('id-ID')}`
