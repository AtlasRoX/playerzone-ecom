"use client";
import Container from './ui/Container'
import { getUniqueColorsFromProducts, COLORS, type ColorLabel } from '@/lib/products'
import { useRouter } from 'next/navigation';
import { useShop } from '@/lib/shop'

export default function ExploreByColors() {
  const router = useRouter()
  const { color, setColor, setCategory, allProducts } = useShop()

  // Dynamically extract colors from actual products in the database managed by admin
  const dynamicColors = getUniqueColorsFromProducts(allProducts)
  const displayColors = dynamicColors.length > 0 
    ? dynamicColors 
    : COLORS.map(c => ({ ...c, count: 0 }))

  const handleColorClick = (swatchLabel: ColorLabel) => {
    setColor(swatchLabel)
    setCategory(null)
    router.push(`/shop?color=${encodeURIComponent(swatchLabel)}`)
  }

  return (
    <Container>
      <div
        id="colors"
        className="flex scroll-mt-24 flex-col items-start gap-6 border-t border-hairline py-10 lg:flex-row lg:items-center lg:gap-25"
      >
        <div className="flex flex-col gap-2 lg:w-64 lg:shrink-0">
          <h2 className="text-[40px] leading-11 tracking-[-2px] text-ink sm:text-[48px] sm:leading-13 lg:text-[60px] lg:leading-16.25 lg:tracking-[-3px]">
            Explore by Colors
          </h2>
          <p className="text-[14px] text-ink/60">
            Find sportswear & footwear matching your favorite shade
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 lg:max-w-210.25">
          {displayColors.map((swatch) => {
            const active = color === swatch.label

            return (
              <button
                key={swatch.label}
                type="button"
                aria-pressed={active}
                onClick={() => handleColorClick(swatch.label)}
                className={`group flex h-12 cursor-pointer items-center gap-3 rounded-full border pl-3 pr-5 transition-all duration-200 lg:h-14.25 ${
                  active
                    ? 'border-ink bg-ink text-white shadow-md'
                    : 'border-ink/80 text-ink hover:border-ink hover:bg-ink/5'
                }`}
              >
                <span
                  className="size-8.25 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-110"
                  style={{
                    backgroundColor: swatch.fill,
                    boxShadow: 'ring' in swatch && swatch.ring ? `inset 0 0 0 1px ${swatch.ring}` : undefined,
                  }}
                />
                <span className="whitespace-nowrap text-[14px] font-semibold leading-6 tracking-[0.5px] lg:text-[15px]">
                  {swatch.label}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-ink/10 text-ink/70'
                  }`}
                >
                  {swatch.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
