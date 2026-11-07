"use client";
import Link from 'next/link';
import Container from './ui/Container'
import Pill from './ui/Pill'
import ProductCard from './ui/ProductCard'
import { getUniqueCategoriesFromProducts, CATEGORIES } from '@/lib/products'
import { useShop } from '@/lib/shop'

export default function Trending() {
  const { category, toggleCategory, filtered, isFiltering, clearFilters, query, color, allProducts } = useShop()

  const dynamicCategories = getUniqueCategoriesFromProducts(allProducts)
  const displayCategories = dynamicCategories.length > 0 ? dynamicCategories : CATEGORIES

  return (
    <Container>
      <div
        id="trending"
        className="flex scroll-mt-24 flex-col items-start gap-6 border-t border-hairline py-8"
      >
        <div className="flex w-full flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-baseline justify-between gap-4 lg:w-auto">
            <p className="text-[30px] leading-9.5 tracking-[-1px] text-ink">Trending</p>
            <Link href="/shop"
              className="whitespace-nowrap text-[13px] font-medium tracking-[1px] text-ink/60 transition-colors hover:text-ink lg:hidden"
            >
              VIEW ALL
            </Link>
          </div>

          {/* Filters scroll horizontally on narrow screens instead of wrapping. */}
          <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 pb-1 md:-mx-8 md:w-[calc(100%+4rem)] md:px-8 lg:mx-0 lg:w-auto lg:overflow-visible lg:px-0 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max items-center gap-2 pr-4 md:pr-8 lg:w-auto lg:gap-2.5 lg:pr-0">
              {displayCategories.map((label) => (
                <Pill
                  key={label}
                  variant={category === label ? 'solid' : 'muted'}
                  ariaPressed={category === label}
                  onClick={() => toggleCategory(label)}
                  className="shrink-0"
                >
                  {label}
                </Pill>
              ))}
            </div>
          </div>

          <Link href="/shop"
            className="hidden whitespace-nowrap text-[13px] font-medium tracking-[1px] text-ink/60 transition-colors hover:text-ink lg:block"
          >
            VIEW ALL
          </Link>
        </div>

        {isFiltering ? (
          <div className="flex flex-wrap items-center gap-3 text-[14px] text-ink/70">
            <span>
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              {query ? ` matching “${query}”` : ''}
              {color ? ` in ${color.toLowerCase()}` : ''}
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer rounded-full border border-[#ddd] px-3 py-1 text-[12px] font-medium tracking-[1px] transition-colors hover:border-ink hover:text-ink"
            >
              CLEAR ALL
            </button>
          </div>
        ) : null}

        {filtered.length > 0 ? (
          <div className="grid w-full grid-cols-12 gap-x-2 gap-y-4 lg:gap-x-2.5 lg:gap-y-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-4 rounded-3xl border border-dashed border-hairline py-16 text-center">
            <p className="text-[20px] tracking-[-0.5px] text-ink">No products match those filters</p>
            <p className="max-w-90 text-[15px] text-ink/70">
              Try a different category or colour, or clear the filters to see everything.
            </p>
            <Pill onClick={clearFilters} className="mt-2">
              CLEAR FILTERS
            </Pill>
          </div>
        )}
      </div>
    </Container>
  )
}
