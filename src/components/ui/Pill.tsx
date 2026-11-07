import type { ReactNode } from 'react'

type PillProps = {
  children: ReactNode
  variant?: 'solid' | 'outline' | 'muted'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  ariaPressed?: boolean
}

const SKINS = {
  solid: 'bg-ink text-white hover:bg-black',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-white',
  muted: 'border border-[#ddd] text-ink/80 hover:border-ink hover:text-ink',
}

/** The rounded button used throughout the design: dark fill or hairline outline. */
export default function Pill({
  children,
  variant = 'outline',
  className = '',
  onClick,
  type = 'button',
  ariaPressed,
}: PillProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-pressed={ariaPressed}
      className={`flex h-12 cursor-pointer items-center justify-center rounded-full px-6 text-[14px] font-medium leading-6 tracking-[1px] transition-colors duration-200 lg:h-12.5 ${SKINS[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
