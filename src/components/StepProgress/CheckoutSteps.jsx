import { Link } from 'react-router-dom'
import Icon from '@/components/Icon'

export default function CheckoutSteps({ step = 2 }) {
  return (
    <nav aria-label="Langkah checkout" className="bg-peach">
      <ol className="mx-auto grid max-w-[1320px] grid-cols-3 items-start gap-3 px-5 py-5 sm:flex sm:items-center sm:justify-between lg:px-8">
        <li className="min-w-0">
          <Link
            to="/keranjang"
            className="flex flex-col items-start gap-2 rounded-lg sm:flex-row sm:items-center sm:gap-3"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-golden font-bold"
            >
              ✓
            </span>
            <span>
              <span className="block text-[9px] font-bold uppercase text-muted sm:text-xs">
                Langkah 1 · Selesai
              </span>
              <span className="text-xs font-semibold sm:text-lg">
                Keranjang Belanja
              </span>
            </span>
          </Link>
        </li>
        <li
          aria-hidden="true"
          className="hidden h-px flex-1 bg-primary/50 sm:mx-4 sm:block lg:mx-12"
        />
        <li
          aria-current={step === 2 ? 'step' : undefined}
          className="flex min-w-0 flex-col items-start gap-2 text-baked sm:flex-row sm:items-center sm:gap-3"
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${step === 2 ? 'bg-baked text-white ring-4 ring-primary/30' : 'bg-golden text-chocolate'}`}
          >
            {step === 2 ? '2' : '✓'}
          </span>
          <span>
            <span className="block text-[9px] font-bold uppercase sm:text-xs">
              {step === 2 ? 'Sedang Aktif •' : 'Langkah 2 · Selesai'}
            </span>
            <span className="text-xs font-bold sm:text-lg">
              {step === 2 ? 'Data & Pengiriman' : 'Alamat & Pengiriman'}
            </span>
          </span>
        </li>
        <li
          aria-hidden="true"
          className="hidden h-px flex-1 bg-primary/20 sm:mx-4 sm:block lg:mx-12"
        />
        <li
          aria-current={step === 3 ? 'step' : undefined}
          className={`flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3 ${step === 3 ? 'text-baked' : 'text-muted/70'}`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${step === 3 ? 'bg-baked text-white ring-4 ring-primary/30' : 'bg-blush'}`}
          >
            {step === 3 ? <Icon name="lock" className="h-4 w-4" /> : '3'}
          </span>
          <span>
            <span className="block text-[9px] font-bold uppercase sm:text-xs">
              {step === 3 ? 'Langkah 3 (Aktif)' : 'Langkah 3'}
            </span>
            <span className="text-xs font-semibold sm:text-lg">
              Pembayaran QRIS
            </span>
          </span>
        </li>
      </ol>
    </nav>
  )
}
