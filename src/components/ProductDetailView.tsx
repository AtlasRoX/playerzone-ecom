/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Pill from "@/components/ui/Pill";
import Rating from "@/components/ui/Rating";
import ProductCard from "@/components/ui/ProductCard";
import { HeartOutlineIcon, RefreshIcon } from "@/components/ui/icons";
import {
  COLORS,
  formatPrice,
  type ColorLabel,
  type Product,
} from "@/lib/products";
import { useShop, type CartLine } from "@/lib/shop";
import { Check, ChevronLeft, ChevronRight, Link2, Truck } from "lucide-react";

type ViewModel = {
  id: string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  details: string[];
  sizes: string[];
  colors: ColorLabel[];
  gallery: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew: boolean;
  trending: boolean;
};

function formatCategory(value: string): string {
  return value
    .toLowerCase()
    .split(/[-\s]+/)
    .map((word, i) =>
      i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(" ")
    .replace(/^T shirt$/i, "T-shirt");
}

export function ProductDetailView({ product }: { product: ViewModel }) {
  const { addToCart, toggleWishlist, isWishlisted, cart, allProducts } = useShop();

  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<ColorLabel | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [tab, setTab] = useState<"description" | "details" | "shipping">(
    "description"
  );

  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];
  const mainImage = gallery[Math.min(active, gallery.length - 1)];

  const liked = isWishlisted(product.id);
  const inCart = cart.filter((line: CartLine) => line.product.id === product.id);
  const needsSize = product.sizes.length > 1 && product.sizes[0] !== "One Size";

  const related = useMemo(() => {
    return allProducts
      .filter((p: Product) => p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product.id]);

  const submit = () => {
    if (needsSize && !size) {
      setSizeError(true);
      return;
    }
    addToCart(
      { ...(product as unknown as Product), price: product.price },
      {
        qty,
        size: size ?? product.sizes[0] ?? "One Size",
        color: color ?? product.colors[0],
      }
    );
  };

  return (
    <Container className="pb-20 pt-6 lg:pb-30">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-[13px] text-ink/50">
        <Link href="/" className="hover:text-ink transition-colors">
          Home
        </Link>
        <span className="px-2">/</span>
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-ink transition-colors"
        >
          {formatCategory(product.category)}
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      {product.slug && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink/[0.04] px-3 py-1.5 text-[12px] text-ink/60 font-mono">
          <Link2 className="w-3 h-3" />
          <span>/product/{product.slug}</span>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-3 lg:w-[58%] lg:shrink-0">
          <div className="relative w-full overflow-hidden rounded-3xl bg-neutral-100 aspect-square">
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActive((i) => (i - 1 + gallery.length) % gallery.length)
                  }
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex size-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-ink hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActive((i) => (i + 1) % gallery.length)}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex size-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-ink hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <img
              key={mainImage}
              src={mainImage}
              alt={product.name}
              className="size-full object-cover animate-[fadeIn_0.3s_ease-out]"
            />

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-3 py-1 rounded-full bg-white text-[11px] font-medium tracking-[0.08em] uppercase text-ink">
                  New
                </span>
              )}
              {!product.inStock && (
                <span className="px-3 py-1 rounded-full bg-red-500 text-[11px] font-medium tracking-[0.08em] uppercase text-white">
                  Out of stock
                </span>
              )}
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-5 gap-2.5">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`aspect-square overflow-hidden rounded-2xl bg-neutral-100 transition-all ${
                    i === active
                      ? "ring-2 ring-ink ring-offset-2"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy panel */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold tracking-[1px] uppercase text-ink/50">
              {formatCategory(product.category)}
            </p>
            <h1 className="text-[36px] leading-10 tracking-[-2px] text-ink sm:text-[48px] sm:leading-13 lg:text-[60px] lg:leading-15.5 lg:tracking-[-3px]">
              {product.name}
            </h1>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Rating value={product.rating} reviews={product.reviews} />
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-medium tracking-[0.08em] uppercase border border-green-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    In stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-medium tracking-[0.08em] uppercase border border-red-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Out of stock
                  </span>
                )}
                {product.trending && (
                  <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-medium tracking-[0.08em] uppercase border border-purple-200/60">
                    Trending
                  </span>
                )}
              </div>
            </div>
            <p className="num text-[28px] leading-9 tracking-[-1px] text-ink lg:text-[32px]">
              {formatPrice(product.price)}
            </p>
          </div>

          {product.description && (
            <p className="max-w-130 text-[16px] leading-6.5 tracking-[-0.3px] text-ink opacity-80 lg:text-[18px]">
              {product.description}
            </p>
          )}

          {/* Colour */}
          {product.colors.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-[1px] text-ink/50">
                  COLOUR
                  {color && (
                    <span className="text-ink"> — {color}</span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((label) => {
                  const swatch = COLORS.find((item) => item.label === label);
                  const active = color === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setColor(active ? null : label)}
                      aria-pressed={active}
                      className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-full border px-4 text-[13px] font-medium transition-colors ${
                        active
                          ? "border-ink text-ink"
                          : "border-[#ddd] text-ink/70 hover:border-ink"
                      }`}
                    >
                      {swatch && (
                        <span
                          className="size-4.5 rounded-full ring-1 ring-inset ring-black/10"
                          style={{ backgroundColor: swatch.fill }}
                        />
                      )}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-[1px] text-ink/50">
                  SIZE
                </p>
                <button
                  type="button"
                  className="cursor-pointer text-[12px] text-ink/50 underline underline-offset-4 hover:text-ink transition-colors"
                >
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((option) => {
                  const active = size === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSize(option);
                        setSizeError(false);
                      }}
                      aria-pressed={active}
                      className={`num h-11 min-w-14 cursor-pointer rounded-full border px-4 text-[14px] font-medium transition-colors ${
                        active
                          ? "border-ink bg-ink text-white"
                          : "border-[#ddd] text-ink/80 hover:border-ink hover:text-ink"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {sizeError && (
                <p className="text-[12px] text-[#f15353]">
                  Choose a size before adding to the bag.
                </p>
              )}
            </div>
          )}

          {/* Quantity + actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-12.5 w-35 items-center justify-between rounded-full border border-[#ddd] px-4.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="cursor-pointer text-[18px] leading-none text-ink/70 hover:text-ink"
              >
                −
              </button>
              <span className="num text-[15px]">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((v) => Math.min(10, v + 1))}
                className="cursor-pointer text-[18px] leading-none text-ink/70 hover:text-ink"
              >
                +
              </button>
            </div>

            <Pill
              variant="solid"
              onClick={submit}
              className="flex-1 sm:min-w-55"
            >
              ADD TO BAG — {formatPrice(product.price * qty)}
            </Pill>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={liked}
              aria-label={
                liked ? "Remove from wishlist" : "Save to wishlist"
              }
              className={`flex size-12.5 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors ${
                liked
                  ? "border-[#f15353] bg-[#f15353] text-white"
                  : "border-[#ddd] text-ink/70 hover:border-ink hover:text-ink"
              }`}
            >
              <HeartOutlineIcon className="h-4.5 w-5" />
            </button>
          </div>

          {inCart.length > 0 && (
            <p className="num text-[13px] text-ink/60">
              Already in your bag:{" "}
              {inCart
                .map((line) => `${line.qty} × ${line.size ?? "One Size"}`)
                .join(", ")}
            </p>
          )}

          <div className="flex items-center gap-2.5 rounded-2xl bg-neutral-50 px-4.5 py-3.5 text-[13px] text-ink/70">
            <RefreshIcon className="size-4 shrink-0 text-ink/50" />
            Free returns within 30 days. Ships in 2&ndash;4 working days.
          </div>

          {/* Detail tabs */}
          <div className="mt-2 border-t border-hairline pt-5">
            <div className="flex gap-6 overflow-x-auto">
              {(
                [
                  ["description", "Description"],
                  ["details", "Details"],
                  ["shipping", "Shipping & returns"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-selected={tab === key}
                  className={`cursor-pointer border-b-2 pb-2.5 text-[14px] font-medium transition-colors whitespace-nowrap ${
                    tab === key
                      ? "border-ink text-ink"
                      : "border-transparent text-ink/50 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="pt-4 text-[15px] leading-6.5 text-ink/75">
              {tab === "description" && (
                <div className="space-y-3">
                  {product.description ? (
                    <p className="text-[15px] leading-6.5 text-ink/75">
                      {product.description}
                    </p>
                  ) : (
                    <p className="text-[14px] text-ink/50 italic">
                      No description provided for this product.
                    </p>
                  )}
                </div>
              )}

              {tab === "details" && (
                <>
                  {product.details.length > 0 ? (
                    <ul className="flex flex-col gap-2 pl-0">
                      {product.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 mt-1 text-ink/60 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[14px] text-ink/50 italic">
                      No additional details.
                    </p>
                  )}
                </>
              )}

              {tab === "shipping" && (
                <ul className="flex flex-col gap-2.5 pl-0">
                  <li className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 mt-1 text-ink/60 shrink-0" />
                    <span>
                      Standard delivery in 2&ndash;4 working days, free over ৳10,000.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-1 text-ink/60 shrink-0" />
                    <span>Express delivery next working day when ordered before 2pm.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-1 text-ink/60 shrink-0" />
                    <span>30 days to return anything unworn, with the tags on.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-1 text-ink/60 shrink-0" />
                    <span>Returns are collected from your door at no cost.</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-hairline pt-9 lg:mt-25">
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] leading-9.5 tracking-[-1px] text-ink">
              You might also like
            </h2>
            <Link
              href="/shop"
              className="hidden text-[13px] font-medium tracking-[1px] text-ink/60 hover:text-ink sm:block"
            >
              VIEW ALL
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-12 gap-x-2 gap-y-6 lg:gap-x-5">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} layout="grid" />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
