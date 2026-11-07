/* eslint-disable @next/next/no-img-element */
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { ProductDetailView } from "@/components/ProductDetailView";
import type { ColorLabel } from "@/lib/products";

// Valid categories for a t-shirt / apparel store
const VALID_CATEGORIES = new Set([
  "T-SHIRT",
  "SHIRT",
  "HOODIE",
  "JACKET",
  "PANTS",
  "SHORTS",
  "ACCESSORIES",
  "HAT",
]);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((v) => String(v)) : [];
  } catch {
    return [];
  }
}

export default async function ProductDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  if (!params.id || params.id.length < 1) notFound();

  const isUuid = UUID_RE.test(params.id);

  // Try to look up by id (if it's a UUID) AND/OR by slug (if it's not).
  const rows = await db
    .select()
    .from(products)
    .where(
      isUuid
        ? or(eq(products.id, params.id), eq(products.slug, params.id))
        : eq(products.slug, params.id)
    )
    .limit(1);

  const dbProduct = rows[0];
  if (!dbProduct) notFound();

  // If the user accessed via the raw uuid, redirect to the canonical slug URL.
  if (isUuid && dbProduct.slug && dbProduct.slug !== params.id) {
    redirect(`/product/${dbProduct.slug}`);
  }

  const category = VALID_CATEGORIES.has(dbProduct.category)
    ? (dbProduct.category as any)
    : "T-SHIRT";

  const primary = dbProduct.image;
  const galleryFromDb = parseJsonArray(dbProduct.gallery);
  const gallery = Array.from(new Set([primary, ...galleryFromDb])).filter(Boolean);

  const viewModel = {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    price: Number(dbProduct.price),
    image: primary,
    category,
    description: dbProduct.description || "",
    details: parseJsonArray(dbProduct.details),
    sizes: parseJsonArray(dbProduct.sizes),
    colors: parseJsonArray(dbProduct.colors) as ColorLabel[],
    gallery,
    rating: Number(dbProduct.rating ?? 0),
    reviews: dbProduct.reviews ?? 0,
    inStock: dbProduct.inStock,
    isNew: dbProduct.isNew,
    trending: dbProduct.trending,
  };

  return <ProductDetailView product={viewModel} />;
}
