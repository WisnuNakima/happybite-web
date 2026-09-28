import { MotionItem, Reveal, Stagger } from './Animation'

const reviews = [
  {
    quote:
      'Gila sih teksturnya pas banget! Garing tipis di luar tapi pas dibelah cokelatnya meleleh ke mana-mana. Cocok banget ditemenin kopi sore!',
    initials: 'AP',
    name: 'Amanda Putri',
    location: 'Jakarta Selatan',
    product: 'Classic Chocochip',
  },
  {
    quote:
      'Pesen buat hampers wisuda temen, packaging-nya super estetik dan aman banget nggak remuk sama sekali. Red velvet cream cheese-nya nagih!',
    initials: 'KA',
    name: 'Kevin Ardiansyah',
    location: 'Tangerang',
    product: 'Box Bundle of 6',
  },
  {
    quote:
      'Nggak nyesel pindah pesen lewat website ini, cepet banget langsung terkonfirmasi otomatis nggak perlu nunggu admin WA bales. 10/10!',
    initials: 'NZ',
    name: 'Nabila Zahra',
    location: 'Depok',
    product: 'Matcha & Dark Choco',
  },
]

export function TestimonialCard({ quote, initials, name, location, product }) {
  return (
    <MotionItem className="rounded-[30px] bg-white p-6">
      <p
        className="tracking-wider text-[#926700]"
        aria-label="5 dari 5 bintang"
      >
        ★★★★★
      </p>
      <blockquote className="mb-4 mt-3 text-sm italic leading-7">
        “{quote}”
      </blockquote>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush text-sm font-bold">
          {initials}
        </span>
        <div>
          <h3 className="text-sm font-bold">{name}</h3>
          <p className="text-xs leading-5 text-muted">
            {location} <span className="text-[#93603D]">• Verified Buyer</span>
          </p>
          <p className="text-[11px] font-semibold">{product}</p>
        </div>
      </div>
    </MotionItem>
  )
}

export default function Testimonials() {
  return (
    <Reveal aria-labelledby="testimonials-heading" className="bg-peach">
      <div className="mx-auto max-w-[1320px] px-5 py-11 lg:px-8">
        <div className="mb-6">
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-baked">
            Ulasan nyata
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold leading-tight tracking-[-1px] sm:text-4xl"
          >
            Kisah Manis dari Pecinta Cookie HappyBite
          </h2>
        </div>
        <Stagger className="grid items-start gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <TestimonialCard key={review.name} {...review} />
          ))}
        </Stagger>
      </div>
    </Reveal>
  )
}
