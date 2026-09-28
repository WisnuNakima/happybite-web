import { Link } from 'react-router-dom'

export default function Brand({ compact = false, subtitle }) {
  return (
    <Link
      to="/"
      aria-label="HappyBite — Beranda"
      className="flex shrink-0 items-center gap-2.5"
    >
      <img src="/favicon.svg" alt="" className="h-9 w-9" />
      <span>
        <span
          className={
            subtitle
              ? 'block text-lg font-bold leading-none tracking-[-.5px]'
              : 'block text-[23px] font-bold leading-none tracking-[-1px]'
          }
        >
          Happy<span className={subtitle ? '' : 'text-baked'}>Bite</span>
        </span>
        {!compact && (
          <span
            className={
              subtitle
                ? 'mt-1 block text-xs'
                : 'mt-1 block text-[9px] font-bold tracking-[1.7px]'
            }
          >
            {subtitle || 'ARTISAN BAKERY'}
          </span>
        )}
      </span>
    </Link>
  )
}
