import Link from 'next/link'
import Container from '@/components/ui/Container'

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start gap-5 py-25 lg:py-40">
      <p className="num text-[11px] font-semibold tracking-[2px] text-ink/40">ERROR 404</p>
      <h1 className="max-w-180 text-[44px] leading-11.5 tracking-[-2px] text-ink sm:text-[60px] sm:leading-15.5 lg:text-[90px] lg:leading-20 lg:tracking-[-5px]">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="max-w-120 text-[16px] leading-6.5 text-ink opacity-80 lg:text-[18px]">
        The link may be out of date, or the product may have sold out and been retired. The full
        collection is still one click away.
      </p>
      <div className="mt-2 flex flex-wrap gap-2.5">
        <Link
          href="/shop"
          className="flex h-12.5 items-center rounded-full bg-ink px-8 text-[14px] font-medium tracking-[1px] text-white transition-colors hover:bg-black"
        >
          BROWSE ALL PRODUCTS
        </Link>
        <Link
          href="/"
          className="flex h-12.5 items-center rounded-full border border-ink px-8 text-[14px] font-medium tracking-[1px] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          BACK HOME
        </Link>
      </div>
    </Container>
  )
}
