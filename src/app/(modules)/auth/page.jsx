// Purpose: This module handles authentication logic and UI.

import Link from "next/link";

const features = [
  {
    title: "Products",
    description: "Manage and organize product catalog.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-11 w-11" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="prod-g1" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B9CCF9" />
            <stop offset="1" stopColor="#5D7EBA" />
          </linearGradient>
          <linearGradient id="prod-g2" x1="6" y1="7" x2="18" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8AA9E6" />
            <stop offset="1" stopColor="#425F97" />
          </linearGradient>
        </defs>
        <path d="M12 2.6 3.6 6.8 12 11l8.4-4.2L12 2.6Z" fill="url(#prod-g1)" />
        <path d="M3.6 6.8V16.6L12 21.4V11L3.6 6.8Z" fill="url(#prod-g2)" />
        <path d="M20.4 6.8V16.6L12 21.4V11l8.4-4.2Z" fill="#6E8FC8" />
        <path d="M6.2 8.1 12 10.9l5.8-2.8" stroke="#D8E4FF" strokeOpacity="0.8" strokeWidth="1.2" strokeLinecap="round" />
        <path
          d="M12 2 3 6.5 12 11l9-4.5L12 2Zm-9 7.5 9 4.5 9-4.5M3 9.5V17l9 5 9-5V9.5"
          stroke="#D6E3FF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Inventory",
    description: "Track stock levels and movements.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-11 w-11" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="inv-g1" x1="7" y1="3" x2="18" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BFD1FF" />
            <stop offset="1" stopColor="#5D7AB7" />
          </linearGradient>
          <linearGradient id="inv-g2" x1="9" y1="8" x2="16" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E6EEFF" />
            <stop offset="1" stopColor="#A9BDE8" />
          </linearGradient>
        </defs>
        <rect x="6" y="3" width="12" height="18" rx="2.5" fill="url(#inv-g1)" />
        <rect x="8.4" y="1.9" width="7.2" height="3.2" rx="1" fill="#86A6E2" />
        <path
          d="M9 4h6m-7 0h8a2 2 0 0 1 2 2v14H6V6a2 2 0 0 1 2-2Z"
          stroke="#DCE7FF"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="m9 11 1.8 1.8L15 8.6M9 16h6"
          stroke="url(#inv-g2)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Suppliers",
    description: "Handle supplier relationships and data.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-11 w-11" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="sup-g1" x1="4" y1="8" x2="20" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C8D9FF" />
            <stop offset="1" stopColor="#5E7DB8" />
          </linearGradient>
          <linearGradient id="sup-g2" x1="5" y1="11" x2="18" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9CB8EA" />
            <stop offset="1" stopColor="#4868A4" />
          </linearGradient>
        </defs>
        <path d="m4 14 3.3-4 4.7 3.3-3.2 4L4 14Z" fill="url(#sup-g1)" />
        <path d="m20 14-3.3-4-4.7 3.3 3.2 4L20 14Z" fill="url(#sup-g1)" />
        <path d="m7.8 12.9 2.6-2.1c1-.8 2.4-.8 3.4 0l2.4 2c.9.7 1.1 2 .4 2.9l-1.8 2.3c-.7.9-2 1.1-2.9.4l-1.5-1.2-1.5 1.2c-.9.7-2.2.5-2.9-.4l-1.8-2.3c-.7-.9-.5-2.2.4-2.9l2.2-1.9Z" fill="url(#sup-g2)" />
        <path
          d="M7.8 12.9 10.4 10.8c1-.8 2.4-.8 3.4 0l2.4 2c.9.7 1.1 2 .4 2.9l-1.8 2.3c-.7.9-2 1.1-2.9.4l-1.5-1.2-1.5 1.2c-.9.7-2.2.5-2.9-.4l-1.8-2.3c-.7-.9-.5-2.2.4-2.9l2.2-1.9Z"
          stroke="#DCE8FF"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m4.2 14.8 3.1 2.4m13.5-2.4-3.1 2.4" stroke="#AFC5F2" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Orders & Reports",
    description: "Process orders and generate insights.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-11 w-11" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="rep-g1" x1="8" y1="3" x2="19" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C0D3FF" />
            <stop offset="1" stopColor="#5E7DB8" />
          </linearGradient>
          <linearGradient id="rep-g2" x1="10" y1="12" x2="16" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E8F0FF" />
            <stop offset="1" stopColor="#A6BDEB" />
          </linearGradient>
        </defs>
        <path d="M7 3h8l4 4v14H7V3Z" fill="url(#rep-g1)" />
        <path d="M15 3v4h4" fill="#88A8E4" />
        <path
          d="M7 3h8l4 4v14H7V3Zm8 0v4h4"
          stroke="#DCE8FF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 17v-3m4 3v-6m4 6v-4"
          stroke="url(#rep-g2)"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <path d="M10 10.5h5.2M10 12.8h3.8" stroke="#BFD2FA" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
];

// Render the main authentication component.
export default function AuthPage() {
  // Render the JSX layout for this section.
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
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition duration-300 hover:scale-[1.02] hover:border-cyan-300/60 hover:shadow-[0_0_36px_rgba(34,211,238,0.28)]"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-cyan-400/0 via-cyan-400/0 to-indigo-400/0 transition group-hover:from-cyan-400/10 group-hover:to-indigo-400/15" />

              <div className="relative flex items-center gap-4 sm:gap-5">
                <div className="inline-flex shrink-0 rounded-2xl bg-linear-to-br from-slate-300/20 via-slate-400/15 to-slate-700/20 p-2.5 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_rgba(6,47,74,0.35)] transition duration-300 group-hover:scale-105 group-hover:text-cyan-100 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_28px_rgba(34,211,238,0.25)]">
                  {feature.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold leading-none text-white sm:text-3xl">{feature.title}</h2>
                  <p className="mt-3 text-base text-slate-300 sm:text-xl">{feature.description}</p>
                </div>
              </div>
            </article>
          ))}
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

