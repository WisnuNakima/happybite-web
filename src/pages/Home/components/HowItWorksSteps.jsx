import StepCard from './StepCard'
import SectionHeading from './SectionHeading'
import { Reveal } from '@/components/Animation'
import Stagger from './Stagger'

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
