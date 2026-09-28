export default function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mx-auto mb-7 max-w-3xl text-center">
      <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-baked">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold leading-tight tracking-[-1px] sm:text-[40px]">
        {title}
      </h2>
      {children && (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          {children}
        </p>
      )}
    </div>
  )
}
