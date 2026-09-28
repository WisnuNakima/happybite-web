import TestimonialCard from './TestimonialCard'
import { Reveal } from '@/components/Animation'
import Stagger from './Stagger'

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
