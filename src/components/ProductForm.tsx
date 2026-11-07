"use client";

import { saveProductAction } from "@/app/admin/(dashboard)/actions";
import { formatPrice } from "@/lib/products";
import { slugify } from "@/lib/slug";
import { useRouter } from "next/navigation";
import { useTransition, useState, useMemo, useRef } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  Link2,
  Loader2,
  Package,
  Palette,
  Star,
  Tag,
  TrendingUp,
  X,
} from "lucide-react";

type ProductDraft = {
  id?: string;
  name?: string;
  slug?: string;
  price?: string | number;
  image?: string;
  category?: string;
  description?: string;
  span?: string;
  colors?: string[] | string;
  sizes?: string[] | string;
  details?: string[] | string;
  gallery?: string[] | string;
  isNew?: boolean;
  inStock?: boolean;
  trending?: boolean;
};

const SPAN_OPTIONS = [
  { value: "col-span-12 lg:col-span-6", label: "Medium" },
  { value: "col-span-12 lg:col-span-4", label: "Small" },
  { value: "col-span-12 lg:col-span-8", label: "Large" },
  { value: "col-span-12", label: "Full" },
];

const CATEGORY_OPTIONS = [
  "T-SHIRT",
  "SHIRT",
  "HOODIE",
  "JACKET",
  "PANTS",
  "SHORTS",
  "ACCESSORIES",
  "HAT",
];

function parseArray(value: string[] | string | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatCategory(value: string): string {
  // "T-SHIRT" -> "T-shirt", "HOODIE" -> "Hoodie"
  return value
    .toLowerCase()
    .split(/[-\s]+/)
    .map((word, i) => (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ")
    .replace(/^T shirt$/i, "T-shirt");
}

function ChipInput({
  label,
  name,
  values,
  onChange,
  placeholder,
  helper,
}: {
  label: string;
  name: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  helper?: string;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw: string) => {
    const next = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (next.length === 0) return;
    onChange(Array.from(new Set([...values, ...next])));
    setDraft("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-ink/60">
          {label}
        </label>
        {helper && <span className="text-[11px] text-ink/40">{helper}</span>}
      </div>
      <div
        className="min-h-[48px] w-full px-3 py-2 bg-white border border-ink/10 rounded-xl focus-within:border-ink/40 focus-within:ring-4 focus-within:ring-ink/5 transition-all cursor-text flex flex-wrap gap-2 items-center"
        onClick={() => inputRef.current?.focus()}
      >
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium tracking-wide rounded-lg bg-ink/5 text-ink border border-ink/5"
          >
            {v}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(values.filter((x) => x !== v));
              }}
              className="text-ink/40 hover:text-ink transition-colors"
              aria-label={`Remove ${v}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit(draft);
            } else if (e.key === "Backspace" && !draft && values.length > 0) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={() => commit(draft)}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (text.includes(",")) {
              e.preventDefault();
              commit(text);
            }
          }}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-[14px] text-ink placeholder:text-ink/30"
        />
      </div>
      <input type="hidden" name={name} value={JSON.stringify(values)} />
    </div>
  );
}

function Toggle({
  name,
  label,
  description,
  checked,
  icon: Icon,
}: {
  name: string;
  label: string;
  description: string;
  checked: boolean | undefined;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <label className="group relative flex items-start gap-3 p-4 bg-white border border-ink/10 rounded-xl cursor-pointer hover:border-ink/30 transition-all has-[:checked]:border-ink has-[:checked]:bg-ink/[0.02]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked ?? false}
        className="peer sr-only"
      />
      <div className="shrink-0 w-9 h-9 rounded-lg bg-ink/5 flex items-center justify-center text-ink/60 peer-checked:bg-ink peer-checked:text-white transition-all">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-ink tracking-tight">{label}</div>
        <div className="text-[12px] text-ink/50 mt-0.5 leading-snug">{description}</div>
      </div>
      <div className="shrink-0 w-5 h-5 rounded-md border border-ink/20 flex items-center justify-center peer-checked:bg-ink peer-checked:border-ink transition-all">
        <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
      </div>
    </label>
  );
}

export function ProductForm({ initialData }: { initialData?: ProductDraft }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData?.slug));
  const [price, setPrice] = useState<string>(initialData?.price?.toString() ?? "");
  const [image, setImage] = useState(initialData?.image ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "T-SHIRT");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [span, setSpan] = useState(initialData?.span ?? "col-span-12 lg:col-span-6");

  const [colors, setColors] = useState<string[]>(parseArray(initialData?.colors));
  const [sizes, setSizes] = useState<string[]>(parseArray(initialData?.sizes));
  const [details, setDetails] = useState<string[]>(parseArray(initialData?.details));
  const [gallery, setGallery] = useState<string[]>(parseArray(initialData?.gallery));

  const isEditing = Boolean(initialData?.id);

  const filledPercent = useMemo(() => {
    const checks = [
      name.trim(),
      price.trim(),
      image.trim(),
      description.trim(),
      colors.length > 0,
      sizes.length > 0,
      gallery.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [name, price, image, description, colors, sizes, gallery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await saveProductAction(formData);
        router.push("/admin");
        router.refresh();
      } catch (err) {
        // keep user on page; surface error inline
        const message = err instanceof Error ? err.message : "Could not save product.";
        alert(message);
      }
    });
  };

  const formattedPrice = useMemo(() => {
    const n = Number(price);
    if (!price || Number.isNaN(n)) return "—";
    return formatPrice(n);
  }, [price]);

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
      {/* MAIN COLUMN */}
      <div className="space-y-8 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium tracking-[0.08em] uppercase text-ink/50 hover:text-ink transition-colors mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <h1 className="text-[28px] font-medium tracking-tight text-ink leading-tight">
              {isEditing ? "Edit product" : "Add new product"}
            </h1>
            <p className="text-[14px] text-ink/50 mt-1.5">
              {isEditing
                ? "Update your product details below."
                : "Fill in the details to publish a new product."}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-ink/40">
              {filledPercent}% complete
            </div>
            <div className="w-40 h-1 bg-ink/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-ink transition-all duration-500"
                style={{ width: `${filledPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section: Identity */}
        <section className="bg-white border border-ink/10 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-ink/60" />
            <h2 className="text-[14px] font-medium tracking-tight text-ink">Identity</h2>
          </div>
          <p className="text-[12px] text-ink/50 mb-5">
            The basics that identify your product.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-ink/60 mb-2">
                Product name
              </label>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => {
                  const next = e.target.value;
                  setName(next);
                  // Auto-update slug until the user edits it manually
                  if (!slugTouched) setSlug(slugify(next));
                }}
                required
                placeholder="e.g. Oversized Heavyweight Tee"
                className="w-full px-4 py-3 bg-white border border-ink/10 rounded-xl text-[15px] text-ink placeholder:text-ink/30 focus:border-ink/40 focus:ring-4 focus:ring-ink/5 focus:outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-ink/60">
                  URL slug
                </label>
                <span className="text-[11px] text-ink/40">
                  {slugTouched ? "Custom" : "Auto-generated"}
                </span>
              </div>
              <div className="flex items-stretch overflow-hidden rounded-xl border border-ink/10 focus-within:border-ink/40 focus-within:ring-4 focus-within:ring-ink/5 transition-all bg-white">
                <span className="flex items-center px-3 bg-ink/[0.03] border-r border-ink/10 text-ink/40 text-[13px]">
                  <Link2 className="w-3.5 h-3.5 mr-1.5" />
                  /product/
                </span>
                <input
                  name="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="oversized-heavyweight-tee"
                  className="flex-1 px-3 py-3 bg-transparent text-[14px] font-mono text-ink placeholder:text-ink/30 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-ink/60 mb-2">
                  Price (BDT)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 text-[15px]">
                    ৳
                  </span>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-white border border-ink/10 rounded-xl text-[15px] text-ink placeholder:text-ink/30 focus:border-ink/40 focus:ring-4 focus:ring-ink/5 focus:outline-none transition-all num"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-ink/60 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none px-4 py-3 pr-10 bg-white border border-ink/10 rounded-xl text-[15px] text-ink focus:border-ink/40 focus:ring-4 focus:ring-ink/5 focus:outline-none transition-all"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {formatCategory(c)}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Media */}
        <section className="bg-white border border-ink/10 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-4 h-4 text-ink/60" />
            <h2 className="text-[14px] font-medium tracking-tight text-ink">Media</h2>
          </div>
          <p className="text-[12px] text-ink/50 mb-5">
            Primary image and gallery URLs.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-ink/60 mb-2">
                Primary image URL
              </label>
              <input
                name="image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 bg-white border border-ink/10 rounded-xl text-[14px] text-ink placeholder:text-ink/30 focus:border-ink/40 focus:ring-4 focus:ring-ink/5 focus:outline-none transition-all font-mono"
              />
            </div>

            <ChipInput
              label="Gallery images"
              name="gallery"
              values={gallery}
              onChange={setGallery}
              placeholder="Add image URL and press Enter"
              helper="Comma-separated URLs"
            />
          </div>
        </section>

        {/* Section: Description */}
        <section className="bg-white border border-ink/10 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-ink/60" />
            <h2 className="text-[14px] font-medium tracking-tight text-ink">Description</h2>
          </div>
          <p className="text-[12px] text-ink/50 mb-5">
            Tell customers about this product.
          </p>

          <div>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="A short, compelling description..."
              className="w-full px-4 py-3 bg-white border border-ink/10 rounded-xl text-[14px] text-ink placeholder:text-ink/30 focus:border-ink/40 focus:ring-4 focus:ring-ink/5 focus:outline-none transition-all resize-y min-h-[120px]"
            />
            <div className="text-[11px] text-ink/40 mt-1.5 text-right">
              {description.length} characters
            </div>
          </div>

          <div className="mt-5">
            <ChipInput
              label="Details"
              name="details"
              values={details}
              onChange={setDetails}
              placeholder="Add a feature or detail"
              helper="Press Enter to add"
            />
          </div>
        </section>

        {/* Section: Variants */}
        <section className="bg-white border border-ink/10 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-4 h-4 text-ink/60" />
            <h2 className="text-[14px] font-medium tracking-tight text-ink">Variants</h2>
          </div>
          <p className="text-[12px] text-ink/50 mb-5">
            Available colors and sizes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ChipInput
              label="Colors"
              name="colors"
              values={colors}
              onChange={setColors}
              placeholder="Add a color"
            />

            <ChipInput
              label="Sizes"
              name="sizes"
              values={sizes}
              onChange={setSizes}
              placeholder="Add a size"
            />
          </div>
        </section>

        {/* Section: Visibility */}
        <section className="bg-white border border-ink/10 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-ink/60" />
            <h2 className="text-[14px] font-medium tracking-tight text-ink">Visibility</h2>
          </div>
          <p className="text-[12px] text-ink/50 mb-5">
            Choose how this product is displayed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Toggle
              name="inStock"
              label="In stock"
              description="Available for purchase"
              checked={initialData ? initialData.inStock : true}
              icon={Check}
            />
            <Toggle
              name="isNew"
              label="Mark as new"
              description="Show a NEW badge"
              checked={initialData?.isNew}
              icon={Tag}
            />
            <Toggle
              name="trending"
              label="Trending"
              description="Surface in trending section"
              checked={initialData?.trending}
              icon={TrendingUp}
            />
          </div>

          <div className="mt-5">
            <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-ink/60 mb-2">
              Layout span
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SPAN_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="cursor-pointer"
                >
                  <input
                    type="radio"
                    name="span"
                    value={opt.value}
                    checked={span === opt.value}
                    onChange={() => setSpan(opt.value)}
                    className="peer sr-only"
                  />
                  <div className="px-3 py-2.5 text-center text-[12px] font-medium border border-ink/10 rounded-lg text-ink/60 hover:border-ink/30 transition-all peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white">
                    {opt.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Hidden field for edit mode */}
        {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-[12px] font-medium tracking-[0.08em] uppercase text-ink/70 bg-white border border-ink/10 rounded-full hover:bg-ink/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-medium tracking-[0.08em] uppercase text-white bg-ink rounded-full hover:bg-black disabled:opacity-50 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                {isEditing ? "Save changes" : "Publish product"}
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* PREVIEW PANE */}
      <aside className="xl:sticky xl:top-8 xl:self-start space-y-4">
        <div className="flex items-center gap-2 text-ink/40">
          <Eye className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase">
            Live preview
          </span>
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          {/* Image */}
          <div className="relative aspect-square bg-ink/5 overflow-hidden">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name || "Preview"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-ink/30">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-[11px] tracking-[0.12em] uppercase">No image</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {initialData?.isNew && (
                <span className="px-2 py-1 text-[10px] font-medium tracking-[0.1em] uppercase bg-white text-ink rounded-md">
                  New
                </span>
              )}
              {!initialData?.inStock && (
                <span className="px-2 py-1 text-[10px] font-medium tracking-[0.1em] uppercase bg-red-500 text-white rounded-md">
                  Out of stock
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-5 space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[15px] font-medium text-ink leading-tight line-clamp-2 min-h-[2.5rem]">
                {name || <span className="text-ink/30">Product name</span>}
              </h3>
              <span className="text-[15px] font-medium text-ink num shrink-0">
                {formattedPrice}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-ink/50">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-[12px] num">0.0</span>
              <span className="text-[12px]">·</span>
              <span className="text-[12px]">{category}</span>
            </div>

            {description && (
              <p className="text-[12px] text-ink/60 leading-relaxed line-clamp-3">
                {description}
              </p>
            )}

            {colors.length > 0 && (
              <div>
                <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-ink/40 mb-2">
                  Colors
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {colors.slice(0, 6).map((c) => (
                    <span
                      key={c}
                      className="px-2 py-1 text-[11px] font-medium tracking-wide rounded-md bg-ink/5 text-ink/70"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div>
                <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-ink/40 mb-2">
                  Sizes
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 text-[11px] font-medium tracking-wide rounded-md bg-white border border-ink/10 text-ink/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white border border-ink/10 rounded-xl p-3 text-center">
            <div className="text-[18px] font-medium text-ink num">{colors.length}</div>
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-ink/40 mt-0.5">
              Colors
            </div>
          </div>
          <div className="bg-white border border-ink/10 rounded-xl p-3 text-center">
            <div className="text-[18px] font-medium text-ink num">{sizes.length}</div>
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-ink/40 mt-0.5">
              Sizes
            </div>
          </div>
          <div className="bg-white border border-ink/10 rounded-xl p-3 text-center">
            <div className="text-[18px] font-medium text-ink num">{gallery.length + 1}</div>
            <div className="text-[10px] font-medium tracking-[0.1em] uppercase text-ink/40 mt-0.5">
              Images
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}
