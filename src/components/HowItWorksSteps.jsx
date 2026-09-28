import Icon from './Icon'
import SectionHeading from './SectionHeading'
import { MotionItem, Reveal, Stagger } from './Animation'

const steps = [
  {
    title: 'Pilih Cookie Favoritmu',
    icon: 'search',
    description:
      'Eksplor menu live catalog, pilih varian satuan atau paket box hampers hemat.',
  },
  {
    title: 'Masukkan ke Keranjang',
    icon: 'cart',
    description:
      'Tentukan jumlah dan tambahkan pesan kartu ucapan jika ingin dijadikan kado.',
  },
  {
    title: 'Checkout & Pembayaran',
    icon: 'money',
    description:
      'Pilih kurir (Instant/Sameday/Reguler) dan bayar aman pakai QRIS, GoPay, atau Bank.',
  },
  {
    title: 'Dipanggang & Dikirim',
    icon: 'truck',
    description:
      'Cookie dipanggang fresh, dikemas aman, dan langsung dikirim ke pintu rumahmu.',
  },
]

export function StepCard({ number, title, icon, description }) {
  return (
    <MotionItem className="rounded-[30px] bg-peach p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-baked text-sm font-bold text-white">
          {number}
        </span>
        <Icon name={icon} className="h-6 w-6 text-baked" />
      </div>
      <h3 className="text-lg font-semibold leading-6">{title}</h3>
      <p className="mt-3 text-sm leading-5 text-muted">{description}</p>
    </MotionItem>
  )
}

export default function HowItWorksSteps() {
  return (
    <Reveal id="cara-pesan" className="scroll-mt-36">
      <div className="mx-auto max-w-[1320px] px-5 py-11 lg:px-8">
        <SectionHeading
          eyebrow="Langkah praktis"
          title="Cara Pesan Mudah Tanpa Ribet"
        >
          Tinggalkan cara lama chat manual di WhatsApp yang lama dibalas. Kini
          pesan HappyBite cukup 4 langkah praktis:
        </SectionHeading>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard key={step.title} number={index + 1} {...step} />
          ))}
        </Stagger>
      </div>
    </Reveal>
  )
}
