import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { deleteProductAction } from "./actions";

export default async function AdminDashboard() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

  const totalProducts = allProducts.length;
  const inStock = allProducts.filter((p) => p.inStock).length;
  const outOfStock = totalProducts - inStock;
  const trending = allProducts.filter((p) => p.trending).length;

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-ink leading-tight">
            Products
          </h1>
          <p className="text-[14px] text-ink/50 mt-1.5">
            Manage your store catalog and inventory.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-ink text-white px-5 py-3 rounded-full text-[12px] font-medium tracking-[0.08em] uppercase shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={totalProducts} />
        <StatCard label="In stock" value={inStock} accent="green" />
        <StatCard label="Out of stock" value={outOfStock} accent="red" />
        <StatCard label="Trending" value={trending} accent="purple" />
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/5">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-ink/60" />
            <h2 className="text-[14px] font-medium tracking-tight text-ink">
              All products
            </h2>
          </div>
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-ink/40 num">
            {totalProducts} {totalProducts === 1 ? "item" : "items"}
          </span>
        </div>

        <table className="w-full text-left text-sm text-ink/80">
          <thead className="bg-ink/[0.02] border-b border-ink/5 text-ink/50 text-[11px] font-medium tracking-[0.12em] uppercase">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {allProducts.map((product) => (
              <tr key={product.id} className="hover:bg-white/60 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="font-medium text-ink text-[14px] leading-snug">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-ink num">
                  {formatPrice(Number(product.price))}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {product.inStock ? (
                      <Badge tone="green">In Stock</Badge>
                    ) : (
                      <Badge tone="red">Out of Stock</Badge>
                    )}
                    {product.isNew && <Badge tone="ink">New</Badge>}
                    {product.trending && <Badge tone="purple">Trending</Badge>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 text-ink/40 hover:text-ink hover:bg-ink/5 rounded-full transition-all"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="p-2 text-ink/40 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {allProducts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center text-ink/40">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-ink">No products yet</p>
                      <p className="text-[12px] text-ink/50 mt-1">
                        Start by adding your first product.
                      </p>
                    </div>
                    <Link
                      href="/admin/products/new"
                      className="mt-2 inline-flex items-center gap-2 bg-ink text-white px-5 py-2.5 rounded-full text-[12px] font-medium tracking-[0.08em] uppercase hover:bg-black transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Product
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "green" | "red" | "purple";
}) {
  const accentDot = {
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    ink: "bg-ink",
  }[accent ?? "ink"];

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-2 mb-2">
        {accent && (
          <span className={`w-1.5 h-1.5 rounded-full ${accentDot}`} />
        )}
        <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-ink/50">
          {label}
        </span>
      </div>
      <div className="text-[24px] font-medium tracking-tight text-ink num">{value}</div>
    </div>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "green" | "red" | "purple" | "ink";
  children: React.ReactNode;
}) {
  const styles = {
    green: "bg-green-50 text-green-700 border-green-200/60",
    red: "bg-red-50 text-red-700 border-red-200/60",
    purple: "bg-purple-50 text-purple-700 border-purple-200/60",
    ink: "bg-ink/5 text-ink border-ink/10",
  }[tone];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium tracking-[0.08em] uppercase border ${styles}`}
    >
      {children}
    </span>
  );
}
