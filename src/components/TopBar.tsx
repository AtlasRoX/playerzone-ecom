"use client";
import { useSectionNav } from '@/lib/navigation'

const RIGHT_LINKS: { label: string; target: string }[] = [
  { label: 'Tracking Package', target: 'footer' },
  { label: 'FAQ', target: 'footer' },
  { label: 'About Us', target: 'footer' },
  { label: 'Contact Us', target: 'footer' },
]

/** Utility bar. The mobile design drops it entirely, so it starts at lg. */
export default function TopBar() {
  const goToSection = useSectionNav()

  return (
    <div className="hidden w-full border-b border-black/5 lg:block">
      <div className="mx-auto flex w-full max-w-360 items-center justify-between px-15 py-6 text-[13px] font-medium leading-4 text-black">
        <div className="flex w-29.5 items-center justify-between">
          <button type="button" className="cursor-pointer opacity-50 hover:opacity-100">
            English
          </button>
          <button type="button" className="cursor-pointer opacity-50 hover:opacity-100">
            ৳ BDT
          </button>
        </div>
        <div className="flex items-center gap-10">
          {RIGHT_LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => goToSection(link.target)}
              className="cursor-pointer whitespace-nowrap opacity-50 transition-opacity hover:opacity-100"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
