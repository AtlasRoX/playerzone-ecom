"use client";
import Container from './ui/Container'
import Pill from './ui/Pill'
import { useRouter } from 'next/navigation';
import { casualComfort, heroSummer, outdoorActive } from './ui/images'

export default function Hero() {
  const router = useRouter()
  return (
    <Container>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-2.5">
        {/* Primary hero card — 958/1320 of the row at desktop */}
        <div className="relative aspect-[343/430] w-full overflow-hidden rounded-3xl sm:aspect-[16/10] lg:aspect-auto lg:h-192.5 lg:w-[72.58%] lg:shrink-0">
          <img
            src={heroSummer}
            alt="Model in a summer outfit seated on a tennis court"
            className="absolute inset-0 size-full object-cover object-[60%_center]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent"
          />

          <div className="absolute left-[24px] top-1/2 flex max-w-70 -translate-y-1/2 flex-col items-start gap-8 lg:left-[60px] lg:top-15 lg:w-82 lg:max-w-none lg:translate-y-0 lg:gap-10">
            <div className="flex w-full flex-col gap-4 text-white lg:gap-5">
              <div className="text-[44px] leading-11 tracking-[-2px] sm:text-[56px] sm:leading-14 sm:tracking-[-4px] lg:text-[72px] lg:leading-16 xl:text-[90px] xl:leading-18.75 xl:tracking-[-5px]">
                <p>Color of</p>
                <p>Summer</p>
                <p>Outfit</p>
              </div>
              <p className="w-full text-[15px] leading-6 tracking-[-0.3px] opacity-80 sm:text-[16px] sm:leading-6.5 lg:text-[18px]">
                100+ Collections for your outfit inspirations in this summer
              </p>
            </div>
            <Pill
              variant="solid"
              onClick={() => router.push('/shop')}
              className="w-full max-w-70 lg:w-70"
            >
              VIEW COLLECTIONS
            </Pill>
          </div>
        </div>

        {/* Secondary stack — side by side on mobile, column at desktop */}
        <div className="flex gap-2 lg:w-[26.66%] lg:shrink-0 lg:flex-col lg:gap-2.5">
          <SideCard
            src={outdoorActive}
            alt="Cyclist riding in outdoor activewear"
            lines={['Outdoor', 'Active']}
            position="object-[65%_center]"
          />
          <SideCard
            src={casualComfort}
            alt="Person wearing a red casual hoodie"
            lines={['Casual', 'Comfort']}
            position="object-[50%_20%]"
          />
        </div>
      </div>
    </Container>
  )
}

function SideCard({
  src,
  alt,
  lines,
  position,
}: {
  src: string
  alt: string
  lines: [string, string]
  position: string
}) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push('/shop')}
      className="group relative aspect-[167/189] w-1/2 cursor-pointer overflow-hidden rounded-3xl text-left lg:aspect-auto lg:h-95 lg:w-full"
    >
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${position}`}
      />
      <div className="absolute left-[16px] top-4 whitespace-nowrap text-[22px] leading-6.5 tracking-[-1px] text-ink sm:text-[32px] sm:leading-8.5 sm:tracking-[-2px] lg:left-[30px] lg:top-7.5 lg:text-[40px] lg:leading-10 lg:tracking-[-3px]">
        <p>{lines[0]}</p>
        <p>{lines[1]}</p>
      </div>
    </button>
  )
}
