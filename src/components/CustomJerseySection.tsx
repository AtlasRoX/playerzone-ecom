"use client";
import Container from './ui/Container'
import Pill from './ui/Pill'
import { useRouter } from 'next/navigation'
import { productSportwear, outdoorActive } from './ui/images'
import { ArrowShortRightIcon } from './ui/icons'

export default function CustomJerseySection() {
  const router = useRouter()

  return (
    <Container>
      <div className="flex flex-col gap-8 border-t border-hairline py-12 lg:py-20">
        {/* Header / Marketing Text */}
        <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3 max-w-2xl text-ink">
            <span className="text-[12px] font-semibold uppercase tracking-[2px] text-ink/60">
              Personalized Sportswear
            </span>
            <h2 className="text-[38px] leading-11 tracking-[-2px] sm:text-[52px] sm:leading-14 sm:tracking-[-3px] lg:text-[62px] lg:leading-16 font-medium">
              Customized Jerseys
            </h2>
            <p className="text-[16px] leading-6.5 text-ink/75 sm:text-[18px]">
              Craft unique uniforms for your sports club, esports roster, or personal outfit. Select premium breathable fabrics, upload custom artwork, and tailor every player's name & number.
            </p>
          </div>
          <Pill
            variant="solid"
            onClick={() => router.push('/custom-jersey')}
            className="w-full sm:w-auto shrink-0"
          >
            START DESIGNING NOW
          </Pill>
        </div>

        {/* 2 Marketing Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 mt-4">
          {/* Card 1: Team & Club Orders */}
          <div
            onClick={() => router.push('/custom-jersey')}
            className="group relative flex h-110 flex-col justify-between overflow-hidden rounded-3xl cursor-pointer p-8 sm:p-10 transition-all duration-300 hover:shadow-xl"
          >
            <img
              src={productSportwear}
              alt="Customized team sports jerseys"
              className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-4 py-1.5 text-[12px] font-medium tracking-[1px] text-white backdrop-blur-md">
                TEAM & CLUB KITS
              </span>
              <span className="text-white/80 text-[13px] font-medium">Full Roster Sizes</span>
            </div>

            <div className="relative z-10 flex flex-col gap-4 text-white">
              <div>
                <h3 className="text-[28px] sm:text-[34px] font-semibold leading-9 tracking-[-1px]">
                  Team Uniforms & Squad Roster
                </h3>
                <p className="mt-2 text-[14px] sm:text-[15px] text-white/80 leading-relaxed max-w-md">
                  Bulk roster management, custom player numbers, and sublimated team logos made with durable performance textiles.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 font-semibold text-[14px] tracking-[1px] group-hover:underline">
                <span>DESIGN TEAM KIT</span>
                <ArrowShortRightIcon className="size-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Card 2: Individual & Custom Graphics */}
          <div
            onClick={() => router.push('/custom-jersey')}
            className="group relative flex h-110 flex-col justify-between overflow-hidden rounded-3xl cursor-pointer p-8 sm:p-10 transition-all duration-300 hover:shadow-xl"
          >
            <img
              src={outdoorActive}
              alt="Individual custom athletic apparel"
              className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-4 py-1.5 text-[12px] font-medium tracking-[1px] text-white backdrop-blur-md">
                UPLOAD YOUR OWN
              </span>
              <span className="text-white/80 text-[13px] font-medium">No Minimum Order</span>
            </div>

            <div className="relative z-10 flex flex-col gap-4 text-white">
              <div>
                <h3 className="text-[28px] sm:text-[34px] font-semibold leading-9 tracking-[-1px]">
                  Personalized Custom Graphics
                </h3>
                <p className="mt-2 text-[14px] sm:text-[15px] text-white/80 leading-relaxed max-w-md">
                  Upload your vector artwork or mockups, select your favorite fabric weave, and let us bring your vision to life.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 font-semibold text-[14px] tracking-[1px] group-hover:underline">
                <span>BUILD SINGLE JERSEY</span>
                <ArrowShortRightIcon className="size-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
