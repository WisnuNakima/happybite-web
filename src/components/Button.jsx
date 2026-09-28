export default function Button({
  children,
  href,
  className = '',
  ...props
}) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-bold text-white shadow-soft transition duration-200 hover:bg-baked active:scale-[0.98] motion-reduce:transform-none ${className}`
  return href ? (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  ) : (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
