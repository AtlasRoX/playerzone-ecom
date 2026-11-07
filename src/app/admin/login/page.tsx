"use client";

import { useActionState, useEffect, useRef } from "react";
import { loginAction } from "./actions";
import gsap from "gsap";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".glass-card",
        { y: 40, opacity: 0, rotateX: 10 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-1 items-center justify-center bg-neutral-50 relative overflow-hidden min-h-dvh p-6"
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-card relative z-10 w-full max-w-md p-10 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white/60">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink/5 mb-4 text-ink/60">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-[28px] font-medium tracking-tight text-ink">
            Admin Login
          </h1>
          <p className="text-[14px] text-ink/50 mt-1.5">
            Enter your credentials to manage products.
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-ink/60 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-white border border-ink/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-ink/5 focus:border-ink/40 transition-all text-[14px] text-ink placeholder:text-ink/30"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-[0.12em] uppercase text-ink/60 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-white border border-ink/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-ink/5 focus:border-ink/40 transition-all text-[14px] text-ink placeholder:text-ink/30"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="p-3.5 text-[13px] text-red-700 bg-red-50 rounded-xl border border-red-100 text-center">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3 px-4 bg-ink text-white text-[12px] font-medium tracking-[0.08em] uppercase rounded-full hover:bg-black focus:outline-none focus:ring-4 focus:ring-ink/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
          >
            {isPending ? "Signing In…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
