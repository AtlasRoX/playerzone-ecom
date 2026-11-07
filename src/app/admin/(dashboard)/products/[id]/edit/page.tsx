import { ProductForm } from "@/components/ProductForm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function EditProductPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const [product] = await db.select().from(products).where(eq(products.id, params.id));

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
      <ProductForm initialData={product as any} />
    </div>
  );
}
