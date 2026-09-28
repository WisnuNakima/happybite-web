import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/Icon'
import { formatOrderDate, formatRupiah } from '@/data/orderHistory'

export default function OrderHistoryDialog({ order, mode, onClose, onSave }) {
  const dialog = useRef(null)
  const [note, setNote] = useState(order.courierNote)
  useEffect(() => {
    const element = dialog.current
    const previousFocus = document.activeElement
    element.showModal()
    document.body.classList.add('overflow-hidden')
    return () => {
      element.close()
      document.body.classList.remove('overflow-hidden')
      previousFocus?.focus()
    }
  }, [])
  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby="history-dialog-title"
      className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-[30px] bg-canvas p-6 text-chocolate shadow-warm backdrop:bg-chocolate/45 sm:p-8"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id="history-dialog-title" className="text-xl font-bold">
          {mode === 'edit' ? 'Ubah Catatan Alamat' : 'Detail Pesanan'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail pesanan"
          className="rounded-full bg-peach p-2"
        >
          <Icon name="close" />
        </button>
      </div>
      <p className="mt-3 text-sm font-bold text-baked">#{order.id}</p>
      <p className="mt-1 text-xs text-muted">
        {formatOrderDate(order.timestamp)}
      </p>
      <h3 className="mt-5 text-xs font-bold">Alamat Pengiriman</h3>
      {order.recipient && (
        <div className="mt-2 space-y-1 text-sm">
          <p className="font-semibold">{order.recipient.name}</p>
          <p>{order.recipient.whatsapp}</p>
          {order.recipient.email && (
            <p className="break-all text-xs text-muted">
              {order.recipient.email}
            </p>
          )}
        </div>
      )}
      <p className="mt-1 text-sm leading-6">{order.address}</p>
      {mode === 'edit' ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSave(order.id, note.trim())
          }}
        >
          <label
            htmlFor="order-courier-note"
            className="mb-2 mt-5 block text-sm font-bold"
          >
            Catatan untuk kurir
          </label>
          <textarea
            id="order-courier-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={300}
            rows={4}
            className="w-full rounded-xl border border-primary/30 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-terracotta/30"
          />
          <p className="mt-1 text-right text-[10px] text-muted">
            {note.length}/300 karakter
          </p>
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-baked px-5 py-3 text-sm font-bold text-white hover:bg-terracotta"
          >
            Simpan Catatan
          </button>
        </form>
      ) : (
        <>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm text-muted">
            {order.courierNote || 'Tidak ada catatan khusus.'}
          </p>
          <ul className="mt-5 space-y-3">
            {order.items.map((item, index) => (
              <li
                key={item.id || `${item.name}-${index}`}
                className="flex justify-between gap-3 text-xs leading-5"
              >
                <span>
                  {item.name} ×{item.quantity}
                  {item.variant && (
                    <span className="block text-muted">{item.variant}</span>
                  )}
                </span>
                <strong className="shrink-0">
                  {formatRupiah(item.price * item.quantity)}
                </strong>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-primary/25 pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Pengiriman</dt>
              <dd>{formatRupiah(order.shipping)}</dd>
            </div>
            <div className="flex justify-between font-bold">
              <dt>Total Pembayaran</dt>
              <dd>{formatRupiah(order.total)}</dd>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <dt>Status Pembayaran</dt>
              <dd>
                {order.paymentStatus} ({order.paymentMethod})
              </dd>
            </div>
          </dl>
        </>
      )}
    </dialog>
  )
}
