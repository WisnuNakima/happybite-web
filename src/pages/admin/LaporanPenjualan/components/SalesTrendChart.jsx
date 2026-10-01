import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/Icon'
import { formatRupiah } from '@/data/orderHistory'
import { periodLabel, salesTrend } from '../utils/salesReport'

const options = [
  ['daily', 'Harian'],
  ['weekly', 'Mingguan'],
  ['monthly', 'Bulanan'],
]

export default function SalesTrendChart({ orders, start, end, validRange }) {
  const [grouping, setGrouping] = useState('daily')
  const [activeKey, setActiveKey] = useState(null)
  const chartContainer = useRef(null)
  const [availableWidth, setAvailableWidth] = useState(720)
  const hasOrders = orders.length > 0
  useEffect(() => {
    if (!chartContainer.current) return
    const observer = new ResizeObserver(([entry]) =>
      setAvailableWidth(Math.floor(entry.contentRect.width)),
    )
    observer.observe(chartContainer.current)
    return () => observer.disconnect()
  }, [hasOrders])
  const { buckets, sparse } = salesTrend(orders, start, end, grouping)
  const peak = buckets.reduce(
    (best, point) => (!best || point.total > best.total ? point : best),
    null,
  )
  const active = buckets.find((point) => point.key === activeKey) || peak
  const maximum = Math.max(...buckets.map((point) => point.total), 1)
  const width = Math.max(720, availableWidth, buckets.length * 54 + 100)
  const step = (width - 100) / Math.max(buckets.length, 1)
  return (
    <section
      aria-labelledby="sales-trend-title"
      className="rounded-2xl border border-primary/10 bg-white p-5 shadow-soft sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="sales-trend-title" className="text-xl font-bold">
            Tren Penjualan & Pendapatan Harian
          </h2>
          <p className="mt-2 text-xs text-muted">
            {validRange ? periodLabel(start, end) : 'Pilih periode yang valid'}{' '}
            · Periode Berjalan
          </p>
        </div>
        <div
          role="group"
          aria-label="Pengelompokan penjualan"
          className="flex rounded-full bg-peach p-1"
        >
          {options.map(([key, label]) => (
            <button
              type="button"
              key={key}
              aria-pressed={grouping === key}
              onClick={() => {
                setGrouping(key)
                setActiveKey(null)
              }}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${grouping === key ? 'bg-baked text-white' : 'hover:bg-blush'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {!orders.length ? (
        <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center text-muted">
          <Icon name="money" className="h-9 w-9 text-primary" />
          <p className="text-sm">Belum ada transaksi pada periode ini</p>
        </div>
      ) : (
        <>
          {active && (
            <div
              aria-live="polite"
              aria-label="Rincian periode grafik"
              className="my-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-chocolate px-4 py-3 text-white"
            >
              <div>
                <p className="text-xs text-primary">
                  {periodLabel(active.start, active.end)}
                  {active.key === peak.key ? ' · Puncak Penjualan' : ''}
                </p>
                <p className="mt-1 text-lg font-bold">
                  {formatRupiah(active.total)}
                </p>
              </div>
              <p className="max-w-sm text-xs leading-5">
                {active.count} Pesanan ·{' '}
                {active.top
                  ? `${active.top.name} (${active.top.quantity} pcs)`
                  : 'Belum ada produk terjual'}
              </p>
            </div>
          )}
          <div
            ref={chartContainer}
            className="overflow-x-auto pb-2"
            aria-label="Grafik pendapatan; geser untuk melihat seluruh periode"
          >
            <svg
              width={width}
              height="285"
              viewBox={`0 0 ${width} 285`}
              className="block min-w-full text-muted"
              role="group"
              aria-label={`Grafik pendapatan ${options.find(([key]) => key === grouping)[1]}`}
            >
              <defs>
                <linearGradient
                  id="sales-bar-gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    className="[stop-color:theme(colors.baked)]"
                  />
                  <stop
                    offset="100%"
                    className="[stop-color:theme(colors.primary)]"
                  />
                </linearGradient>
              </defs>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                <g key={ratio}>
                  <line
                    x1="84"
                    x2={width}
                    y1={235 - ratio * 200}
                    y2={235 - ratio * 200}
                    className="stroke-primary/30"
                    strokeDasharray="3 4"
                  />
                  <text
                    x="76"
                    y={239 - ratio * 200}
                    textAnchor="end"
                    className="fill-muted text-[10px]"
                  >
                    {formatRupiah(Math.round(maximum * ratio))}
                  </text>
                </g>
              ))}
              {buckets.map((point, index) => {
                const height = (point.total / maximum) * 200
                const x = 90 + index * step + step / 2
                const description = `${periodLabel(point.start, point.end)}: ${formatRupiah(point.total)}, ${point.count} pesanan${point.top ? `, terlaris ${point.top.name}` : ''}`
                return (
                  <g
                    key={point.key}
                    role="button"
                    tabIndex="0"
                    aria-label={description}
                    aria-pressed={active?.key === point.key}
                    onMouseEnter={() => setActiveKey(point.key)}
                    onFocus={() => setActiveKey(point.key)}
                    onClick={() => setActiveKey(point.key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveKey(point.key)
                      }
                    }}
                    className="cursor-pointer focus:outline-none focus-visible:[&>rect]:stroke-baked focus-visible:[&>rect]:stroke-2"
                  >
                    <title>{description}</title>
                    <rect
                      x={x - 15}
                      y="30"
                      width="30"
                      height="205"
                      fill="transparent"
                    />
                    <rect
                      x={x - 11}
                      y={235 - height}
                      width="22"
                      height={height}
                      rx="10"
                      fill={
                        point.key === peak.key
                          ? undefined
                          : 'url(#sales-bar-gradient)'
                      }
                      className={point.key === peak.key ? 'fill-baked' : ''}
                    />
                    <text
                      x={x}
                      y="256"
                      textAnchor="middle"
                      className="fill-muted text-[10px]"
                    >
                      {point.start.slice(8)} / {point.start.slice(5, 7)}
                    </text>
                    <text
                      x={x}
                      y="272"
                      textAnchor="middle"
                      className="fill-muted text-[9px]"
                    >
                      {point.start.slice(0, 4)}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
          {sparse && (
            <p className="mt-2 text-xs text-muted">
              Periode tanpa transaksi tidak ditampilkan untuk rentang tanggal
              yang panjang.
            </p>
          )}
        </>
      )}
    </section>
  )
}
