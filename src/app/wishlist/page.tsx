"use client";
import Link from 'next/link'
import Container from '@/components/ui/Container'
import ProductCard from '@/components/ui/ProductCard'
import { useShop } from '@/lib/shop'

export default function Wishlist() {
  const { wishlistProducts } = useShop()

  return (
    <Container className="pb-20 pt-6 lg:pb-30">
      <nav aria-label="Breadcrumb" className="text-[13px] text-ink/50">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">Wishlist</span>
      </nav>

      <header className="mt-4 flex flex-col gap-2 border-b border-hairline pb-7">
        <h1 className="text-[40px] leading-11 tracking-[-2px] text-ink sm:text-[52px] sm:leading-14 lg:text-[65px] lg:leading-16.25 lg:tracking-[-4px]">
          Saved Items
        </h1>
        <p className="num text-[15px] text-ink/60">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
        </p>
      </header>

      {wishlistProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-12 gap-x-2 gap-y-6 lg:gap-x-5 lg:gap-y-9">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} layout="grid" />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-hairline py-20 text-center">
          <p className="text-[20px] tracking-[-0.5px] text-ink">Nothing saved yet</p>
          <p className="max-w-95 text-[15px] text-ink/70">
            Tap the heart on any product and it will wait for you here.
          </p>
          <Link
            href="/shop"
            className="mt-2 flex h-12.5 items-center rounded-full border border-ink px-8 text-[14px] font-medium tracking-[1px] text-ink transition-colors hover:bg-ink hover:text-white"
          >
            BROWSE PRODUCTS
          </Link>
        </div>
      )}
    </Container>
  )
}
