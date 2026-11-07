import { db } from "@/lib/db";
import { customDesigns } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function DesignsPage() {
  const designs = await db.select().from(customDesigns).orderBy(desc(customDesigns.createdAt));

  async function addDesign(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    if (name && image) {
      await db.insert(customDesigns).values({ name, image });
      revalidatePath("/admin/designs");
    }
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight text-ink">Custom Designs</h1>
        <p className="text-ink/60 mt-2">Manage predefined designs available for custom jerseys</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-ink/5 shadow-sm mb-8">
        <h2 className="text-xl font-medium mb-4">Add New Design</h2>
        <form action={addDesign} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-ink/70 mb-1">Design Name</label>
            <input type="text" name="name" required className="w-full border border-ink/10 rounded-xl px-4 py-2" placeholder="e.g. Classic Stripes" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-ink/70 mb-1">Image URL</label>
            <input type="url" name="image" required className="w-full border border-ink/10 rounded-xl px-4 py-2" placeholder="https://..." />
          </div>
          <button type="submit" className="px-6 py-2 bg-black text-white rounded-xl font-medium">Add Design</button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {designs.map(design => (
          <div key={design.id} className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
            <img src={design.image} alt={design.name} className="w-full aspect-[3/4] object-cover" />
            <div className="p-4 flex justify-between items-center bg-neutral-50 border-t border-ink/5">
              <span className="font-medium text-sm">{design.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${design.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600'}`}>
                {design.isActive ? 'Active' : 'Hidden'}
              </span>
            </div>
          </div>
        ))}
        {designs.length === 0 && (
          <div className="col-span-full py-12 text-center text-ink/50 bg-white rounded-3xl border border-ink/5">
            No designs added yet.
          </div>
        )}
      </div>
    </div>
  );
}
