"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slug";

function toStringArray(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  const raw = String(value).trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v).trim()).filter(Boolean);
    }
  } catch {
    // fall through to comma split
  }
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/** Find a unique slug by appending -2, -3, … when needed. */
async function ensureUniqueSlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  if (!baseSlug) baseSlug = "product";
  let candidate = baseSlug;
  let i = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(
        excludeId
          ? and(eq(products.slug, candidate), ne(products.id, excludeId))
          : eq(products.slug, candidate)
      )
      .limit(1);
    if (existing.length === 0) return candidate;
    candidate = `${baseSlug}-${i}`;
    i += 1;
    if (i > 100) return `${baseSlug}-${Date.now()}`; // hard fallback
  }
}

export async function deleteProductAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function saveProductAction(formData: FormData) {
  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const slugInput =
    ((formData.get("slug") as string | null)?.trim() ?? "") || slugify(name);
  const priceStr = (formData.get("price") as string | null)?.trim() ?? "";
  const image = (formData.get("image") as string | null)?.trim() ?? "";
  const category = ((formData.get("category") as string | null)?.trim() ?? "T-SHIRT").toUpperCase();
  const description = (formData.get("description") as string | null)?.trim() ?? "";
  const span = ((formData.get("span") as string | null)?.trim() ?? "col-span-12 lg:col-span-6");

  const priceNum = Number(priceStr);

  if (!name) throw new Error("Product name is required.");
  if (!priceStr || Number.isNaN(priceNum) || priceNum < 0) {
    throw new Error("A valid price is required.");
  }
  if (!image) throw new Error("Image URL is required.");

  const slug = await ensureUniqueSlug(slugify(slugInput), id ?? undefined);

  const colors = toStringArray(formData.get("colors"));
  const sizes = toStringArray(formData.get("sizes"));
  const details = toStringArray(formData.get("details"));
  const gallery = toStringArray(formData.get("gallery"));

  const inStock = formData.get("inStock") === "on";
  const isNew = formData.get("isNew") === "on";
  const trending = formData.get("trending") === "on";

  const values = {
    name,
    slug,
    price: priceStr,
    image,
    category,
    colors: JSON.stringify(colors),
    span,
    description,
    details: JSON.stringify(details),
    sizes: JSON.stringify(sizes),
    gallery: JSON.stringify(gallery),
    isNew,
    inStock,
    trending,
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(products).set(values).where(eq(products.id, id));
  } else {
    await db.insert(products).values(values);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/product/${id ?? slug}`);
}
