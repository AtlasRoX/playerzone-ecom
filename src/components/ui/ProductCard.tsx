"use client";
import Link from 'next/link';
import { useShop } from '@/lib/shop'
import { formatPrice, type Product } from '@/lib/products'
import { HeartOutlineIcon } from './icons'

type Props = {
  product: Product
  /** `editorial` honours the product's asymmetric span; `grid` is uniform. */
  layout?: 'editorial' | 'grid'
}

export default function ProductCard({ product, layout = 'editorial' }: Props) {
  const { toggleWishlist, isWishlisted, addToCart } = useShop()
  const liked = isWishlisted(product.id)

  const span = layout === 'grid' ? 'col-span-6 lg:col-span-3' : product.span
  const href = `/product/${(product as any).slug ?? product.id}`

  return (
    <div className={span}>
      <div className="group relative h-41 w-full overflow-hidden rounded-3xl bg-neutral-100 sm:h-60 md:h-75 lg:h-93.5">
        <Link href={href} className="absolute inset-0 block">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="sr-only">View {product.name}</span>
        </Link>

        <button
          type="button"
          aria-label={
            liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
          aria-pressed={liked}
          onClick={() => toggleWishlist(product.id)}
          className={`absolute right-[12px] top-3 flex size-9 cursor-pointer items-center justify-center rounded-full backdrop-blur-sm transition-colors duration-200 lg:right-[20px] lg:top-5 lg:size-10 ${
            liked ? 'bg-[#f15353]' : 'bg-ink/25 hover:bg-ink/45'
          }`}
        >
          <HeartOutlineIcon className="h-4 w-4.5 text-white lg:h-4.5 lg:w-5" />
        </button>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="absolute inset-x-[12px] bottom-3 h-10 cursor-pointer rounded-full bg-white/95 text-[13px] font-semibold tracking-[1.5px] text-ink opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-100 lg:inset-x-[20px] lg:bottom-5 lg:h-11 lg:text-[14px]"
        >
          ADD TO CART
        </button>
      </div>

      <Link href={href}
        className="mt-2.5 block truncate text-[16px] font-medium leading-6 tracking-[-0.5px] text-ink transition-opacity hover:opacity-70 sm:text-[20px] lg:mt-3 lg:text-[24px] lg:leading-8 lg:tracking-[-1px]"
      >
        {product.name}
      </Link>
      <p className="num mt-0.5 text-[14px] leading-5.5 text-ink opacity-80 sm:text-[18px] lg:mt-1 lg:text-[20px] lg:leading-7 lg:tracking-[-1px]">
        {formatPrice(product.price)}
      </p>
    </div>
  )
}
