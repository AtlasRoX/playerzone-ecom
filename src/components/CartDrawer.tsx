"use client";
import { useEffect } from 'react'
import Link from 'next/link';
import { formatPrice } from '@/lib/products'
import { useShop } from '@/lib/shop'
import Pill from './ui/Pill'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart, cartTotal, cartCount } = useShop()

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!cartOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCartOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [cartOpen, setCartOpen])

  return (
    <>
      <div
        aria-hidden
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          cartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal={cartOpen}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-105 flex-col bg-white transition-transform duration-300 ease-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <p className="text-[20px] font-medium tracking-[-0.5px] text-ink">
            Your Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </p>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="cursor-pointer text-[24px] leading-none text-ink/60 hover:text-ink"
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-[18px] text-ink">Your cart is empty</p>
            <p className="max-w-65 text-[14px] text-ink/60">
              Browse the trending collection and add something you like.
            </p>
            <Link href="/shop"
              onClick={() => setCartOpen(false)}
              className="mt-2 flex h-12.5 items-center rounded-full border border-ink px-8 text-[14px] font-medium tracking-[1px] text-ink transition-colors hover:bg-ink hover:text-white"
            >
              KEEP SHOPPING
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.map((line) => (
                <div
                  key={line.key}
                  className="flex gap-4 border-b border-hairline py-4 last:border-b-0"
                >
                  <img
                    src={line.product.image}
                    alt={line.product.name}
                    className="size-20 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/product/${line.product.id}`}
                      onClick={() => setCartOpen(false)}
                      className="truncate text-[16px] font-medium text-ink hover:opacity-70"
                    >
                      {line.product.name}
                    </Link>
                    {line.size || line.color ? (
                      <p className="text-[12px] text-ink/50">
                        {[line.size, line.color].filter(Boolean).join(' · ')}
                      </p>
                    ) : null}
                    <p className="num text-[14px] text-ink/70">{formatPrice(line.product.price)}</p>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center gap-3 rounded-full border border-hairline px-3 py-1">
                        <button
                          type="button"
                          aria-label={`Decrease ${line.product.name} quantity`}
                          onClick={() => setQty(line.key, line.qty - 1)}
                          className="cursor-pointer text-[16px] leading-none text-ink/70 hover:text-ink"
                        >
                          −
                        </button>
                        <span className="num min-w-4 text-center text-[14px]">{line.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${line.product.name} quantity`}
                          onClick={() => setQty(line.key, line.qty + 1)}
                          className="cursor-pointer text-[16px] leading-none text-ink/70 hover:text-ink"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.key)}
                        className="cursor-pointer text-[12px] tracking-[1px] text-ink/50 hover:text-[#f15353]"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-hairline px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[14px] text-ink/70">Subtotal</span>
                <span className="num text-[24px] tracking-[-1px] text-ink">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <Pill variant="solid" className="w-full">
                CHECKOUT
              </Pill>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
