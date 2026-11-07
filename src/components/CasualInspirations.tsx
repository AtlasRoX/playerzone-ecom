"use client";
import Container from './ui/Container'
import Pill from './ui/Pill'
import Placeholder from './ui/Placeholder'
import { useRouter } from 'next/navigation';
import { ArrowShortRightIcon } from './ui/icons'

export default function CasualInspirations() {
  const router = useRouter()
  return (
    <Container>
      <div className="mt-10 mb-10 flex flex-col items-start border-b border-hairline py-10 lg:mt-20 lg:mb-20 lg:flex-row lg:items-center lg:border-b-0 lg:py-0">
        <div className="flex w-full flex-col items-start gap-8 lg:h-95 lg:w-102.75 lg:shrink-0 lg:justify-center lg:gap-10.5 lg:pr-15">
          <div className="flex flex-col items-start gap-5 text-ink lg:gap-6">
            <div className="text-[44px] leading-12 tracking-[-2px] sm:text-[56px] sm:leading-15 sm:tracking-[-3px] lg:whitespace-nowrap lg:text-[65px] lg:leading-16.25 lg:tracking-[-4px]">
              <p>Casual</p>
              <p>Inspirations</p>
            </div>
            <p className="max-w-110 text-[16px] leading-6.5 tracking-[-0.3px] opacity-80 lg:text-[18px]">
              Our favorite combinations for casual outfit that can inspire you to apply on your
              daily activity.
            </p>
          </div>
          <Pill onClick={() => router.push('/shop')} className="w-full max-w-70">
            BROWSE INPIRATIONS
          </Pill>
        </div>

        {/* The mobile design omits these two frames, and the export never shipped
            their photography — so they appear from lg up only. */}
        <div className="hidden flex-1 items-center gap-2.5 lg:flex">
          <InspirationCard lines={['Say it ', 'with Shirt']} label="Graphic tees" />
          <InspirationCard lines={['Funky never ', 'get old']} label="Street style" />
        </div>
      </div>
    </Container>
  )
}

function InspirationCard({ lines, label }: { lines: [string, string]; label: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.push('/shop')}
      className="group relative h-95 flex-1 cursor-pointer overflow-hidden rounded-3xl text-left"
    >
      <Placeholder className="absolute inset-0" tone="dark" label={label} />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
      />
      <div className="absolute inset-x-[30px] bottom-7.5 flex items-end justify-between gap-4">
        <div className="whitespace-pre-wrap text-[40px] leading-10 tracking-[-3px] text-white">
          <p>{lines[0]}</p>
          <p>{lines[1]}</p>
        </div>
        <ArrowShortRightIcon className="size-12.5 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </button>
  )
}
