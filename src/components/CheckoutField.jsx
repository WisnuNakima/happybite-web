import Icon from './Icon'

export default function CheckoutField({
  name,
  label,
  icon,
  value,
  onChange,
  hint,
  helper,
  error,
  required = false,
  multiline = false,
  children,
  ...inputProps
}) {
  const id = `checkout-${name}`
  const controlClass =
    'min-w-0 w-full flex-1 border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted/70 focus-visible:ring-0 focus-visible:ring-offset-0'
  const shared = {
    id,
    name,
    value,
    onChange,
    required,
    'aria-invalid': !!error,
    'aria-describedby':
      [error && `${id}-error`, helper && `${id}-helper`]
        .filter(Boolean)
        .join(' ') || undefined,
    className: controlClass,
    ...inputProps,
  }
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-xs">
        <label htmlFor={id} className="font-semibold">
          {label}
        </label>
        {required && (
          <span className="text-[10px] font-semibold text-baked">*Wajib</span>
        )}
        {hint && <span className="text-[10px] text-muted">{hint}</span>}
      </div>
      <div
        className={`flex items-start gap-2 rounded-2xl border bg-white px-3 shadow-soft focus-within:ring-2 focus-within:ring-terracotta/30 ${error ? 'border-baked' : 'border-primary/10'}`}
      >
        <Icon name={icon} className="mt-3.5 h-4 w-4 text-muted" />
        {children ? (
          <select {...shared}>{children}</select>
        ) : multiline ? (
          <textarea {...shared} rows={2} />
        ) : (
          <input {...shared} />
        )}
      </div>
      {helper && (
        <p id={`${id}-helper`} className="mt-2 text-xs leading-5 text-muted">
          {helper}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs leading-5 text-baked"
        >
          {error}
        </p>
      )}
    </div>
  )
}
