import type { ReactNode } from 'react'

/**
 * Shared page gutter. Tracks the design's 16px mobile / 60px desktop margins
 * and caps content at the 1440px frame the design was drawn to.
 */
export default function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-360 px-4 md:px-8 lg:px-15 ${className}`}>
      {children}
    </div>
  )
}
