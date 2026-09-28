import MotionItem from './MotionItem'

export default function TestimonialCard({
  quote,
  initials,
  name,
  location,
  product,
}) {
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
