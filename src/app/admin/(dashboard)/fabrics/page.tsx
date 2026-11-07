import { db } from "@/lib/db";
import { fabrics } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function FabricsPage() {
  const allFabrics = await db.select().from(fabrics).orderBy(desc(fabrics.createdAt));

  async function addFabric(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    if (name) {
      await db.insert(fabrics).values({ name, description, image: image || null });
      revalidatePath("/admin/fabrics");
    }
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight text-ink">Fabrics</h1>
        <p className="text-ink/60 mt-2">Manage fabric options for custom jerseys</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-ink/5 shadow-sm mb-8">
        <h2 className="text-xl font-medium mb-4">Add New Fabric</h2>
        <form action={addFabric} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-ink/70 mb-1">Fabric Name</label>
            <input type="text" name="name" required className="w-full border border-ink/10 rounded-xl px-4 py-2" placeholder="e.g. DryFit Mesh" />
          </div>
          <div className="flex-[2] min-w-[300px]">
            <label className="block text-sm font-medium text-ink/70 mb-1">Description</label>
            <input type="text" name="description" className="w-full border border-ink/10 rounded-xl px-4 py-2" placeholder="Breathable and lightweight..." />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-ink/70 mb-1">Image URL (Optional)</label>
            <input type="url" name="image" className="w-full border border-ink/10 rounded-xl px-4 py-2" placeholder="https://..." />
          </div>
          <button type="submit" className="px-6 py-2 bg-black text-white rounded-xl font-medium shrink-0">Add Fabric</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allFabrics.map(fabric => (
          <div key={fabric.id} className="bg-white rounded-2xl border border-ink/5 overflow-hidden flex flex-col">
            {fabric.image && (
              <img src={fabric.image} alt={fabric.name} className="w-full h-40 object-cover bg-neutral-100" />
            )}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{fabric.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${fabric.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600'}`}>
                  {fabric.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p className="text-sm text-ink/60 flex-1">{fabric.description || 'No description provided.'}</p>
            </div>
          </div>
        ))}
        {allFabrics.length === 0 && (
          <div className="col-span-full py-12 text-center text-ink/50 bg-white rounded-3xl border border-ink/5">
            No fabrics added yet.
          </div>
        )}
      </div>
    </div>
  );
}
