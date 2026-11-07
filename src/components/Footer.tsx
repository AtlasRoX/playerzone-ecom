"use client";
import { useState, type FormEvent } from 'react'
import { CATEGORIES } from '@/lib/products'
import { useRouter } from 'next/navigation';
import { useShop } from '@/lib/shop'
import { useSectionNav } from '@/lib/navigation'

const COLUMNS: { heading: string; links: { label: string; target: string }[] }[] = [
  {
    heading: 'POPULAR',
    links: [
      { label: 'T-Shirt', target: 'trending' },
      { label: 'Shoes', target: 'trending' },
      { label: 'Jackets', target: 'trending' },
      { label: 'Hat', target: 'trending' },
      { label: 'All Products', target: 'shop' },
    ],
  },
  {
    heading: 'MENU',
    links: [
      { label: 'Gift Cards', target: 'colors' },
      { label: 'All Category', target: 'trending' },
      { label: 'Special Events', target: 'testimonial' },
      { label: 'Testimonial', target: 'testimonial' },
    ],
  },
  {
    heading: 'OTHER',
    links: [
      { label: 'FAQ', target: 'footer' },
      { label: 'Tracking Package', target: 'footer' },
      { label: 'About Us', target: 'footer' },
      { label: 'Contact Us', target: 'footer' },
      { label: 'Terms and Conditions', target: 'footer' },
    ],
  },
]

export default function Footer() {
  const { setCategory } = useShop()
  const goToSection = useSectionNav()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!valid) {
      setStatus('error')
      return
    }
    setStatus('done')
    setEmail('')
  }

  const handleLink = (label: string, target: string) => {
    const match = CATEGORIES.find(
      (category) => category.replace('-', '').toLowerCase() === label.replace('-', '').toLowerCase(),
    )
    if (target === 'shop' || match || label === 'All Category') {
      setCategory(match ?? null)
      router.push('/shop')
      return
    }
    goToSection(target)
  }

  return (
    <footer id="footer" className="w-full scroll-mt-24 bg-ink">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-10 px-4 py-10 md:px-8 lg:flex-row lg:items-start lg:justify-between lg:gap-15 lg:px-15 lg:py-15">
        <div className="flex flex-col items-start gap-6.25 lg:shrink-0">
          <div className="flex max-w-72.5 flex-col items-start gap-3 text-white">
            <a href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Player Zone"
                className="h-10 sm:h-12 w-auto object-contain max-w-48 bg-white/90 p-1 rounded-lg"
              />
            </a>
            <p className="text-[14px] leading-5.5 opacity-[0.65]">
              Player Zone — Premium custom jerseys, athletic sportswear, and custom team uniforms built for performance.
            </p>
          </div>

          <form onSubmit={submit} className="flex w-full max-w-91.25 flex-col gap-2.5">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setStatus('idle')
                }}
                placeholder="Type your email address"
                aria-label="Email address"
                className={`h-11.25 w-full rounded-full border bg-transparent px-6 text-[13px] leading-5.25 text-white outline-none transition-colors placeholder:text-white/[0.52] sm:w-62.5 ${
                  status === 'error' ? 'border-[#f15353]' : 'border-white/[0.52] focus:border-white'
                }`}
              />
              <button
                type="submit"
                className="h-11.25 w-full shrink-0 cursor-pointer rounded-full bg-white text-[13px] font-semibold leading-5.25 text-ink transition-opacity hover:opacity-90 sm:w-26.25"
              >
                Submit
              </button>
            </div>
            {status === 'error' ? (
              <p className="text-[12px] text-[#f15353]">Please enter a valid email address.</p>
            ) : null}
            {status === 'done' ? (
              <p className="text-[12px] text-white/80">Thanks — you&rsquo;re on the list.</p>
            ) : null}
          </form>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-8 text-white sm:grid-cols-3 lg:flex lg:gap-25">
          {COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col items-start gap-4">
              <p className="text-[11px] font-semibold leading-4 tracking-[1px]">
                {column.heading}
              </p>
              {column.links.map((link) => (
                <button
                  key={`${column.heading}-${link.label}`}
                  type="button"
                  onClick={() => handleLink(link.label, link.target)}
                  className="cursor-pointer whitespace-nowrap text-left text-[13px] font-medium leading-4 opacity-[0.52] transition-opacity hover:opacity-100"
                >
                  {link.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
