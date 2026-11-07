"use client";
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Container from '@/components/ui/Container'
import Pill from '@/components/ui/Pill'
import ProductCard from '@/components/ui/ProductCard'
import {
  getUniqueCategoriesFromProducts,
  getUniqueColorsFromProducts,
  getColorSwatch,
  CATEGORIES,
  COLORS,
  type Category,
  type ColorLabel,
  type Product,
} from '@/lib/products'
import { SORTS, useShop, type Sort } from '@/lib/shop'

function ShopContent() {
  const {
    category,
    setCategory,
    toggleCategory,
    color,
    setColor,
    toggleColor,
    query,
    setQuery,
    sort,
    setSort,
    clearFilters,
    results,
    isFiltering,
    allProducts,
  } = useShop()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const searchParams = useSearchParams()

  const dynamicCategories = getUniqueCategoriesFromProducts(allProducts)
  const availableCategories = dynamicCategories.length > 0 ? dynamicCategories : CATEGORIES

  const dynamicColors = getUniqueColorsFromProducts(allProducts)
  const availableColors = dynamicColors.length > 0 ? dynamicColors : COLORS.map(c => ({ ...c, count: 0 }))

  useEffect(() => {
    const colorParam = searchParams.get('color')
    if (colorParam) {
      setColor(colorParam)
      setCategory(null)
    }
  }, [searchParams, setColor, setCategory])

  const filterPanel = (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3.5">
        <p className="text-[11px] font-semibold tracking-[1px] text-ink/50">CATEGORY</p>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-colors lg:border-0 lg:px-0 lg:py-1 ${
              category === null
                ? 'border-ink bg-ink text-white lg:bg-transparent lg:text-ink font-semibold'
                : 'border-[#ddd] text-ink/70 hover:text-ink'
            }`}
          >
            All Products
          </button>
          {availableCategories.map((item: Category) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleCategory(item)}
              aria-pressed={category === item}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-colors lg:border-0 lg:px-0 lg:py-1 ${
                category === item
                  ? 'border-ink bg-ink text-white lg:bg-transparent lg:text-ink font-semibold'
                  : 'border-[#ddd] text-ink/70 hover:text-ink'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="text-[11px] font-semibold tracking-[1px] text-ink/50">COLOUR</p>
        <div className="flex flex-wrap gap-2.5">
          {availableColors.map((swatch: { label: ColorLabel; fill: string }) => {
            const active = color === swatch.label
            return (
              <button
                key={swatch.label}
                type="button"
                onClick={() => toggleColor(swatch.label)}
                aria-pressed={active}
                aria-label={swatch.label}
                title={swatch.label}
                className={`flex size-7.5 cursor-pointer items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                  active ? 'border-ink shadow-sm' : 'border-transparent'
                }`}
              >
                <span
                  className="size-5.5 rounded-full ring-1 ring-inset ring-black/10"
                  style={{ backgroundColor: swatch.fill }}
                />
              </button>
            )
          })}
        </div>
        {color ? (
          <div className="flex items-center gap-2 text-[12px] font-medium text-ink/70">
            <span>Selected: <strong>{color}</strong></span>
            <button
              type="button"
              onClick={() => setColor(null)}
              className="text-[11px] underline hover:text-ink"
            >
              Clear
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="text-[11px] font-semibold tracking-[1px] text-ink/50">SORT BY</p>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
          {SORTS.map((item: Sort) => (
            <button
              key={item}
              type="button"
              onClick={() => setSort(item)}
              aria-pressed={sort === item}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-colors lg:border-0 lg:px-0 lg:py-1 ${
                sort === item
                  ? 'border-ink bg-ink text-white lg:bg-transparent lg:text-ink font-semibold'
                  : 'border-[#ddd] text-ink/70 hover:text-ink'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {isFiltering || sort !== 'FEATURED' ? (
        <button
          type="button"
          onClick={clearFilters}
          className="cursor-pointer self-start rounded-full border border-[#ddd] px-4 py-2 text-[12px] font-medium tracking-[1px] text-ink/70 transition-colors hover:border-ink hover:text-ink"
        >
          RESET ALL
        </button>
      ) : null}
    </div>
  )

  return (
    <Container className="pb-20 pt-6 lg:pb-30">
      <nav aria-label="Breadcrumb" className="text-[13px] text-ink/50">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">All Products</span>
      </nav>

      <header className="mt-4 flex flex-col gap-4 border-b border-hairline pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] leading-11 tracking-[-2px] text-ink sm:text-[52px] sm:leading-14 lg:text-[65px] lg:leading-16.25 lg:tracking-[-4px]">
            All Products
          </h1>
          <p className="num text-[15px] text-ink/60">
            {results.length} of {allProducts.length} items
            {category ? ` in ${category.toLowerCase()}` : ''}
            {color ? ` matching ${color}` : ''}
          </p>
        </div>

        <div className="flex h-11 w-full items-center gap-2 rounded-full border border-[#e3e3e3] px-5 focus-within:border-ink lg:w-80">
          <input
            value={query}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            placeholder="Search all products"
            aria-label="Search all products"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-[#737b8b]"
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
          ) : null}
        </div>
      </header>

      <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:gap-12">
        <aside className="lg:w-50 lg:shrink-0">
          <button
            type="button"
            onClick={() => setFiltersOpen((open: boolean) => !open)}
            aria-expanded={filtersOpen}
            className="flex w-full cursor-pointer items-center justify-between rounded-full border border-[#ddd] px-5 py-3 text-[13px] font-medium tracking-[1px] text-ink lg:hidden"
          >
            FILTER &amp; SORT
            <span className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>
          <div className={`${filtersOpen ? 'mt-6 block' : 'hidden'} lg:mt-0 lg:block`}>
            {filterPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {results.length > 0 ? (
            <div className="grid grid-cols-12 gap-x-2 gap-y-6 lg:gap-x-5 lg:gap-y-9">
              {results.map((product: Product) => (
                <ProductCard key={product.id} product={product} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-hairline py-20 text-center">
              <p className="text-[20px] tracking-[-0.5px] text-ink">Nothing matches those filters</p>
              <p className="max-w-90 text-[15px] text-ink/70">
                Try a different category or colour, or reset to see the full catalogue.
              </p>
              <Pill onClick={clearFilters} className="mt-2">
                RESET FILTERS
              </Pill>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink/60">Loading products...</div>}>
      <ShopContent />
    </Suspense>
  )
}
