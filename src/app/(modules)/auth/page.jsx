"use client";

import Link from "next/link";
import { Package, Boxes, Truck, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Products",
    description: "Manage and organize product catalog.",
    icon: Package,
  },
  {
    title: "Inventory",
    description: "Track stock levels and movements.",
    icon: Boxes,
  },
  {
    title: "Suppliers",
    description: "Handle supplier relationships and data.",
    icon: Truck,
  },
  {
    title: "Orders & Reports",
    description: "Process orders and generate insights.",
    icon: BarChart3,
  },
];

export default function AuthPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.22),transparent_42%),radial-gradient(circle_at_80%_15%,rgba(99,102,241,0.24),transparent_36%),linear-gradient(180deg,rgba(2,6,23,0.9),rgba(2,6,23,1))]" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center">
        <p className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
          Inventory Platform
        </p>

        <h1 className="mt-6 text-center text-5xl font-black tracking-[0.22em] text-white sm:text-6xl">
          STACKIT
        </h1>

        <p className="mt-4 max-w-2xl text-center text-base text-slate-300 sm:text-lg">
          Inventory & Supply Chain Optimization System
        </p>

        <div className="mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition duration-300 hover:scale-[1.02] hover:border-cyan-300/60 hover:shadow-[0_0_36px_rgba(34,211,238,0.28)]"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-cyan-400/0 via-cyan-400/0 to-indigo-400/0 transition group-hover:from-cyan-400/10 group-hover:to-indigo-400/15" />

                <div className="relative flex items-center gap-4 sm:gap-5">
                  <div className="inline-flex shrink-0 rounded-2xl bg-linear-to-br from-slate-300/20 via-slate-400/15 to-slate-700/20 p-2.5 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_rgba(6,47,74,0.35)] transition duration-300 group-hover:scale-105 group-hover:text-cyan-100 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_28px_rgba(34,211,238,0.25)]">
                    <Icon className="h-11 w-11" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold leading-none text-white sm:text-3xl">{feature.title}</h2>
                    <p className="mt-3 text-base text-slate-300 sm:text-xl">{feature.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <Link
          href="/auth/pages/login"
          className="mt-10 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-cyan-400 to-indigo-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/35 transition hover:scale-105 hover:from-cyan-300 hover:to-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
        >
          Continue to Login
        </Link>
      </section>
    </main>
  );
}
