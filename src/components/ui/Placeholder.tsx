type PlaceholderProps = {
  className?: string
  label?: string
  tone?: 'light' | 'dark'
}

/**
 * Stand-in for the photography in the imported design. The Figma export
 * referenced PNG assets that were not delivered with the import, so every
 * image slot renders as a neutral block at the exact size the design calls for.
 */
export default function Placeholder({ className = '', label, tone = 'light' }: PlaceholderProps) {
  const surface = tone === 'dark' ? 'bg-neutral-700' : 'bg-neutral-200'
  const ink = tone === 'dark' ? 'text-white/35' : 'text-neutral-400'

  return (
    <div className={`${surface} relative overflow-hidden ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(0,0,0,0.035) 0 1px, transparent 1px 12px)',
        }}
      />
      {label ? (
        <span
          className={`absolute bottom-4 left-5 text-[11px] tracking-[1px] uppercase ${ink}`}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}
