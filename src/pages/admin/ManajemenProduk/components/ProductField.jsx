export const inputClass =
  'w-full min-w-0 rounded-full border border-muted/50 bg-peach px-4 py-2.5 text-sm outline-none focus:border-baked focus:ring-2 focus:ring-baked/15 focus-visible:ring-offset-0'

export default function ProductField({
  label,
  name,
  error,
  children,
  ...props
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={`product-${name}`}
        className="mb-1.5 block text-xs font-semibold"
      >
        {label}
      </label>
      {children || (
        <input
          id={`product-${name}`}
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={inputClass}
          {...props}
        />
      )}
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 text-xs text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  )
}
