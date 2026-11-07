"use client";
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useShop } from '@/lib/shop'
import { useSectionNav } from '@/lib/navigation'
import { getUniqueCategoriesFromProducts, CATEGORIES, type Category } from '@/lib/products'
import { CartIcon, ChevronDownIcon, SearchIcon } from './ui/icons'

const UTILITY_LINKS: { label: string; target: string }[] = [
  { label: 'Tracking Package', target: 'footer' },
  { label: 'FAQ', target: 'footer' },
  { label: 'About Us', target: 'footer' },
  { label: 'Contact Us', target: 'footer' },
]

export default function Navigation() {
  const { query, setQuery, setCategory, category, wishlist, cartCount, setCartOpen, allProducts } = useShop()
  const goToSection = useSectionNav()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  const dynamicCategories = getUniqueCategoriesFromProducts(allProducts)
  const categoriesList = dynamicCategories.length > 0 ? dynamicCategories : CATEGORIES

  /** Any category choice lands on the shop page with that filter applied. */
  const pickCategory = (value: Category | null) => {
    setCategory(value)
    setCategoryOpen(false)
    setMenuOpen(false)
    router.push('/shop')
  }

  const search = (
    <div className="flex h-10 w-full items-center gap-2 rounded-full border border-[#e3e3e3] px-5 focus-within:border-ink lg:h-8.5 lg:max-w-78">
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          router.push('/shop')
        }}
        placeholder="Search here"
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent text-[14px] leading-4.5 text-ink outline-none placeholder:text-[#737b8b] lg:text-[13px]"
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="cursor-pointer text-[16px] leading-none text-[#737b8b] hover:text-ink"
        >
          ×
        </button>
      ) : (
        <SearchIcon className="size-3.5 shrink-0 text-icon opacity-50" />
      )}
    </div>
  )

  const isShopActive = pathname === '/shop'
  const navLinkClass = `flex items-center h-8.5 cursor-pointer whitespace-nowrap text-[14px] font-semibold leading-4 text-black transition-opacity ${
    isShopActive ? 'opacity-100 underline underline-offset-[10px]' : 'opacity-80 hover:opacity-100'
  }`

  return (
    <div className="sticky top-0 z-40 w-full border-b border-transparent bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-360 items-center justify-between gap-6 px-4 py-5 md:px-8 lg:h-20 lg:px-15 lg:py-0">
        <Link
          href="/"
          className="shrink-0 flex items-center gap-2"
        >
          <img
            src="/logo.png"
            alt="Player Zone"
            className="h-10 sm:h-12 w-auto object-contain max-w-48"
          />
        </Link>

        {/* Desktop search + categories */}
        <div className="hidden flex-1 items-center justify-between gap-6 lg:flex xl:gap-10">
          {search}
          <div className="flex items-center gap-6 xl:gap-10">
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryOpen((open: boolean) => !open)}
                aria-expanded={categoryOpen}
                className="flex h-8.5 cursor-pointer items-center gap-2 whitespace-nowrap text-[14px] font-semibold leading-4 text-black opacity-80 hover:opacity-100"
              >
                All Category
                <ChevronDownIcon
                  className={`h-1.85 w-3 text-icon transition-transform ${
                    categoryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {categoryOpen ? (
                <div className="absolute left-0 top-10.5 z-50 w-45 overflow-hidden rounded-2xl border border-hairline bg-white py-2 shadow-lg">
                  <button
                    type="button"
                    onClick={() => pickCategory(null)}
                    className="block w-full border-b border-hairline px-4 py-2 text-left text-[13px] font-medium text-ink hover:bg-neutral-100"
                  >
                    All Products
                  </button>
                  {categoriesList.map((item: Category) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => pickCategory(item)}
                      className={`block w-full px-4 py-2 text-left text-[13px] font-medium hover:bg-neutral-100 ${
                        category === item ? 'text-ink' : 'text-ink/70'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <Link href="/shop" className={navLinkClass}>
              Shop
            </Link>
            <Link
              href="/custom-jersey"
              className={`flex items-center h-8.5 cursor-pointer whitespace-nowrap text-[14px] font-semibold leading-4 text-black transition-opacity ${
                pathname === '/custom-jersey' ? 'opacity-100 underline underline-offset-[10px]' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Custom Jersey
            </Link>
            <Link
              href="/pre-designed-jerseys"
              className={`flex items-center h-8.5 cursor-pointer whitespace-nowrap text-[14px] font-semibold leading-4 text-black transition-opacity ${
                pathname === '/pre-designed-jerseys' ? 'opacity-100 underline underline-offset-[10px]' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Pre-Designed Kits
            </Link>
            <button
              type="button"
              onClick={() => goToSection('testimonial')}
              className="flex items-center h-8.5 cursor-pointer whitespace-nowrap text-[14px] font-semibold leading-4 text-black opacity-80 hover:opacity-100"
            >
              Special Event
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4.5 text-icon lg:gap-6">
          <button
            type="button"
            aria-label={`Cart, ${cartCount} items`}
            onClick={() => setCartOpen(true)}
            className="relative cursor-pointer transition-opacity hover:opacity-70"
          >
            <CartIcon className="size-5.25" />
            <Badge count={cartCount} />
          </button>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open: boolean) => !open)}
            className="cursor-pointer text-black lg:hidden"
          >
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? <path d="M6 6L18 18M18 6L6 18" /> : <path d="M4 6H20M4 12H20M4 18H20" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="max-h-[70vh] overflow-y-auto border-t border-hairline bg-white px-4 pb-8 pt-5 md:px-8 lg:hidden">
          {search}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => pickCategory(null)}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                category === null ? 'border-ink bg-ink text-white' : 'border-[#ddd] text-ink/80'
              }`}
            >
              All
            </button>
            {categoriesList.map((item: Category) => (
              <button
                key={item}
                type="button"
                onClick={() => pickCategory(item)}
                className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                  category === item ? 'border-ink bg-ink text-white' : 'border-[#ddd] text-ink/80'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-hairline pt-6">
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="text-[14px] font-medium text-ink"
            >
              Shop all products
            </Link>
            <Link
              href="/custom-jersey"
              onClick={() => setMenuOpen(false)}
              className="text-[14px] font-medium text-ink"
            >
              Custom Jersey Builder
            </Link>
            <Link
              href="/pre-designed-jerseys"
              onClick={() => setMenuOpen(false)}
              className="text-[14px] font-medium text-ink"
            >
              Pre-Designed Kits
            </Link>
            {UTILITY_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  goToSection(link.target)
                }}
                className="text-left text-[14px] text-ink opacity-60"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Badge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="num absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#f15353] text-[10px] font-semibold text-white">
      {count > 9 ? '9+' : count}
    </span>
  )
}
