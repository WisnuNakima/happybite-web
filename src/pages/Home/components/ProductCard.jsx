import MotionItem from './MotionItem'

export default function ProductCard({
  name,
  category,
  badge,
  image,
  description,
}) {
  return (
    <MotionItem
      hover
      className="group overflow-hidden rounded-[30px] bg-white p-2 shadow-soft"
    >
      <div className="relative overflow-hidden rounded-[24px]">
        <img
          src={image}
          alt={name}
          width="600"
          height="600"
          loading="lazy"
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-bold ${badge}`}
        >
          {category}
        </span>
      </div>
      <div className="px-1.5 pb-3 pt-3">
        <h3 className="text-lg font-semibold leading-6">{name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted">
          {description}
        </p>
      </div>
    </MotionItem>
  )
}
