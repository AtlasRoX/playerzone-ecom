import { signOut } from "@/auth";
import Link from "next/link";
import { LogOut, Package, Home, ShoppingCart, Paintbrush, Scissors } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full min-h-screen bg-neutral-50 flex overflow-hidden relative">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="relative z-10 w-72 bg-white/70 backdrop-blur-2xl border-r border-white/50 flex-col hidden md:flex shadow-[20px_0_40px_rgba(0,0,0,0.02)]">
        <div className="p-8 border-b border-ink/5">
          <Link
            href="/admin"
            className="text-[20px] font-medium tracking-tight text-ink"
          >
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-6 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-[12px] font-medium tracking-[0.08em] uppercase text-ink/60 hover:text-ink hover:bg-white/50 rounded-xl transition-all"
          >
            <Package className="w-4 h-4" />
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 text-[12px] font-medium tracking-[0.08em] uppercase text-ink/60 hover:text-ink hover:bg-white/50 rounded-xl transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            Orders
          </Link>
          <Link
            href="/admin/designs"
            className="flex items-center gap-3 px-4 py-3 text-[12px] font-medium tracking-[0.08em] uppercase text-ink/60 hover:text-ink hover:bg-white/50 rounded-xl transition-all"
          >
            <Paintbrush className="w-4 h-4" />
            Designs
          </Link>
          <Link
            href="/admin/fabrics"
            className="flex items-center gap-3 px-4 py-3 text-[12px] font-medium tracking-[0.08em] uppercase text-ink/60 hover:text-ink hover:bg-white/50 rounded-xl transition-all"
          >
            <Scissors className="w-4 h-4" />
            Fabrics
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-[12px] font-medium tracking-[0.08em] uppercase text-ink/60 hover:text-ink hover:bg-white/50 rounded-xl transition-all"
          >
            <Home className="w-4 h-4" />
            View Store
          </Link>
        </nav>
        <div className="p-6 border-t border-ink/5">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="flex items-center gap-3 w-full px-4 py-3 text-[12px] font-medium tracking-[0.08em] uppercase text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
