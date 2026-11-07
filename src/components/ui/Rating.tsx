/** Five stars with a clipped overlay for the fractional part. */
export default function Rating({
  value,
  reviews,
  className = '',
}: {
  value: number
  reviews?: number
  className?: string
}) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100))

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="relative inline-flex"
        role="img"
        aria-label={`Rated ${value} out of 5`}
        title={`${value} out of 5`}
      >
        <Stars className="text-ink/15" />
        <span
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${percent}%` }}
          aria-hidden
        >
          <Stars className="text-[#f4cf4e]" />
        </span>
      </div>
      <span className="num text-[13px] text-ink/60">
        {value.toFixed(1)}
        {reviews !== undefined ? ` (${reviews})` : ''}
      </span>
    </div>
  )
}

function Stars({ className }: { className: string }) {
  return (
    <span className={`flex shrink-0 gap-0.5 ${className}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <svg key={index} viewBox="0 0 20 20" className="size-3.75 shrink-0 fill-current">
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z" />
        </svg>
      ))}
    </span>
  )
}
