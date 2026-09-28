import Icon from './Icon'

const stages = [
  ['warm', 'Oven Dapur'],
  ['bag', 'Quality Box Pack'],
  ['truck', 'Kurir Menuju Alamat'],
  ['home', 'Tiba di Rumah'],
]

export default function OrderTracking({ stage, times, estimatedArrival }) {
  return (
    <section
      aria-label="Pelacakan pengiriman"
      className="mt-5 rounded-2xl bg-peach p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Icon name="truck" className="h-5 w-5 text-baked" />
          Lacak Antaran Langsung
        </h3>
        <p className="flex items-center gap-1 text-xs font-bold text-baked">
          <Icon name="clock" className="h-4 w-4" />
          Estimasi Tiba: {estimatedArrival}
        </p>
      </div>
      <ol className="mt-6 grid gap-0 sm:grid-cols-4">
        {stages.map(([icon, label], index) => (
          <li
            key={label}
            aria-current={index === stage ? 'step' : undefined}
            className="relative flex gap-4 pb-6 last:pb-0 sm:block sm:pb-0"
          >
            {index < stages.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-4 top-8 h-full w-0.5 sm:left-4 sm:top-4 sm:h-1 sm:w-full ${index < stage ? 'bg-baked' : 'bg-primary/25'}`}
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${index <= stage ? 'bg-baked text-white' : 'bg-blush text-muted'} ${index === stage ? 'ring-4 ring-primary/50 motion-safe:animate-pulse' : ''}`}
            >
              {index < stage ? (
                <span aria-label="Selesai">✓</span>
              ) : (
                <Icon name={icon} className="h-4 w-4" />
              )}
            </span>
            <div className="relative mt-0.5 sm:mt-3 sm:pr-3">
              <p
                className={`text-xs font-bold ${index === stage ? 'text-baked' : index > stage ? 'text-muted' : ''}`}
              >
                {label}
              </p>
              <p
                className={`mt-1 text-[10px] leading-5 ${index === stage ? 'font-semibold text-baked' : 'text-muted'}`}
              >
                {times[index]}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
