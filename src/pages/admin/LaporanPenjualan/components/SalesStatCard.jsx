import Icon from '@/components/Icon'

export default function SalesStatCard({ label, value, icon, detail }) {
  return (
    <article
      aria-label={label}
      className="min-w-0 rounded-2xl border border-primary/10 bg-white p-5 shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xs font-semibold leading-5">{label}</h2>
        <span
          className={`rounded-full p-2.5 ${icon === 'cookie' ? 'bg-golden' : 'bg-blush'}`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
      <p
        className="mt-4 break-words text-xl font-bold leading-7"
        data-stat-value
      >
        {value}
      </p>
      {detail && <p className="mt-2 text-xs text-muted">{detail}</p>}
    </article>
  )
}
