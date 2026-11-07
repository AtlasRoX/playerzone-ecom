import { db } from "@/lib/db";
import { customOrders, customDesigns, fabrics } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";

export default async function OrdersPage() {
  const allOrders = await db
    .select({
      order: customOrders,
      design: customDesigns,
      fabric: fabrics,
    })
    .from(customOrders)
    .leftJoin(customDesigns, eq(customOrders.designId, customDesigns.id))
    .leftJoin(fabrics, eq(customOrders.fabricId, fabrics.id))
    .orderBy(desc(customOrders.createdAt));

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-medium tracking-tight text-ink">Custom Jersey Orders</h1>
        <p className="text-ink/60 mt-2">Manage incoming custom jersey requests</p>
      </div>

      <div className="space-y-6">
        {allOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-ink/5">
            <p className="text-ink/60">No custom orders yet.</p>
          </div>
        ) : (
          allOrders.map(({ order, design, fabric }) => (
            <div key={order.id} className="bg-white p-6 rounded-3xl border border-ink/5 shadow-sm flex flex-col md:flex-row gap-8">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{order.customerName}</h3>
                    <p className="text-ink/60">{order.customerPhone}</p>
                  </div>
                  <span className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-medium uppercase tracking-wider">
                    {order.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-ink/50 mb-1">Design</p>
                    <p className="font-medium">{design?.name || 'Custom Upload'}</p>
                  </div>
                  <div>
                    <p className="text-ink/50 mb-1">Fabric</p>
                    <p className="font-medium">{fabric?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-ink/50 mb-1">Quantity</p>
                    <p className="font-medium">{order.quantity} jerseys</p>
                  </div>
                  <div>
                    <p className="text-ink/50 mb-1">Total</p>
                    <p className="font-medium">${order.totalAmount}</p>
                  </div>
                </div>

                {order.note && (
                  <div className="mb-4">
                    <p className="text-ink/50 text-sm mb-1">Notes</p>
                    <p className="text-sm bg-neutral-50 p-3 rounded-lg">{order.note}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-ink/50 text-sm mb-2">Roster</p>
                  <div className="max-h-40 overflow-y-auto bg-neutral-50 rounded-lg border border-neutral-100 p-2">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="text-ink/60 border-b border-neutral-200">
                          <th className="pb-2 font-medium">Name</th>
                          <th className="pb-2 font-medium">Number</th>
                          <th className="pb-2 font-medium">Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.roster as any[]).map((player, idx) => (
                          <tr key={idx} className="border-b border-neutral-100 last:border-0">
                            <td className="py-2">{player.name || '-'}</td>
                            <td className="py-2">{player.number || '-'}</td>
                            <td className="py-2">{player.size}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Design Image */}
              <div className="w-full md:w-64 shrink-0">
                <p className="text-ink/50 text-sm mb-2">Design Reference</p>
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 relative">
                  {(order.customDesignImage || design?.image) ? (
                    <img 
                      src={(order.customDesignImage || design?.image) as string} 
                      alt="Design" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink/30">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
