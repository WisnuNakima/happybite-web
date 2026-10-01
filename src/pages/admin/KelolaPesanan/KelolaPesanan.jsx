import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useOrders } from '@/context/ordersContext'
import { customerName, fulfillmentOf, orderKey } from '@/data/orderFulfillment'
import OrdersToolbar from './components/OrdersToolbar'
import OrdersTable from './components/OrdersTable'
import OrderDetailPanel from './components/OrderDetailPanel'
import { exportOrdersCsv } from './utils/ordersCsv'

const pageSize = 5

export default function KelolaPesanan() {
  const { adminOrders: orders, advanceOrder } = useOrders()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const [status, setStatus] = useState('all')
  const [delivery, setDelivery] = useState('all')
  const [payment, setPayment] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedKey, setSelectedKey] = useState(null)
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [])
  const filtered = orders.filter(
    (order) =>
      (status === 'all' || fulfillmentOf(order) === status) &&
      (delivery === 'all' ||
        (order.deliveryMethod || 'Belum ditentukan') === delivery) &&
      (payment === 'all' || order.paymentStatus === payment) &&
      `${order.id} ${customerName(order)}`
        .toLocaleLowerCase('id-ID')
        .includes(query.trim().replace(/^#/, '').toLocaleLowerCase('id-ID')),
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const visible = filtered.slice(start, start + pageSize)
  // Keep the selected order visible in the panel even when its new status moves it out of a filter.
  const selected = orders.find((order) => orderKey(order) === selectedKey)
  return (
    <div>
      <header className="mb-7 max-w-xl">
        <h1 className="text-3xl font-bold leading-snug tracking-tight">
          Kelola Pesanan & Distribusi Pengiriman
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Pantau antrean baking, koordinasi kurir instan, dan perbarui status
          pesanan pelanggan secara real-time.
        </p>
      </header>
      <OrdersToolbar
        orders={orders}
        status={status}
        onStatus={(value) => {
          setStatus(value)
          setPage(1)
        }}
        query={query}
        onQuery={(value) => {
          setParams(value ? { q: value } : {}, { replace: true })
          setPage(1)
        }}
        delivery={delivery}
        onDelivery={(value) => {
          setDelivery(value)
          setPage(1)
        }}
        payment={payment}
        onPayment={(value) => {
          setPayment(value)
          setPage(1)
        }}
        onExport={() => exportOrdersCsv(filtered)}
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <section
          aria-label="Daftar pesanan admin"
          className="min-w-0 overflow-hidden rounded-2xl shadow-soft"
        >
          <OrdersTable
            orders={visible}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            now={now}
          />
          <footer className="flex flex-wrap items-center justify-between gap-4 bg-peach px-4 py-4 text-xs text-muted">
            <p>
              Menampilkan {filtered.length ? start + 1 : 0} -{' '}
              {Math.min(start + pageSize, filtered.length)} dari{' '}
              {filtered.length} Pesanan Aktif
            </p>
            <nav aria-label="Pagination pesanan" className="flex gap-1">
              <button
                type="button"
                aria-label="Halaman sebelumnya"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="h-8 w-8 rounded-full bg-white disabled:opacity-30"
              >
                ‹
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1)
                .filter(
                  (n) =>
                    n === 1 ||
                    n === pageCount ||
                    Math.abs(n - currentPage) <= 1,
                )
                .map((n) => (
                  <button
                    type="button"
                    key={n}
                    aria-label={`Halaman ${n}`}
                    aria-current={n === currentPage ? 'page' : undefined}
                    onClick={() => setPage(n)}
                    className={`h-8 w-8 rounded-full ${n === currentPage ? 'bg-baked text-white' : 'bg-white'}`}
                  >
                    {n}
                  </button>
                ))}
              <button
                type="button"
                aria-label="Halaman berikutnya"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
                className="h-8 w-8 rounded-full bg-white disabled:opacity-30"
              >
                ›
              </button>
            </nav>
          </footer>
        </section>
        <div className="min-w-0 lg:sticky lg:top-6">
          <OrderDetailPanel
            key={selectedKey || 'empty'}
            order={selected}
            now={now}
            onClose={() => setSelectedKey(null)}
            onAdvance={advanceOrder}
          />
        </div>
      </div>
    </div>
  )
}
