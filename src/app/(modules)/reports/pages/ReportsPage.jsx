"use client";

// Purpose: This module handles reports/dashboard logic and UI.

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, TrendingUp } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { getCurrentUser } from "../../auth/services/authService";
import { getAuthToken } from "../../../../lib/authCookies";
import { isAdminRole } from "../../../../lib/userRoles";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Format currency for display
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

// Format large numbers (e.g., 1000 → 1k, 1000000 → 1M)
function formatNumber(value) {
  const num = Number(value) || 0;
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return String(num);
}

// Format tick labels for currency axis
function formatCurrencyTick(value) {
  if (value === 0) {
    return "$0";
  }
  return `$${formatNumber(value)}`;
}

// Normalize monthly data to 12 months
function normalizeMonthlyData(data = []) {
  const normalized = Array(12).fill(0);

  if (Array.isArray(data)) {
    data.forEach((item) => {
      const monthIndex = item.month ? parseInt(item.month, 10) - 1 : -1;
      if (monthIndex >= 0 && monthIndex < 12) {
        normalized[monthIndex] = Number(item.total || 0);
      }
    });
  }

  return normalized;
}

// Render the main reports component.
export default function ReportsPage() {
  const router = useRouter();
  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  // Call dashboard hook BEFORE any conditional returns (React rules)
  const {
    purchases,
    orders,
    topProducts,
    lowStock,
    finance,
    isLoading,
    error,
  } = useDashboard();

  // Normalize monthly data to 12 month arrays
  const monthlyPurchases = useMemo(() => normalizeMonthlyData(purchases), [purchases]);
  const monthlyOrders = useMemo(() => normalizeMonthlyData(orders), [orders]);

  // Compute chart dimensions and scales
  const chartHeight = 180;
  const chartWidth = 900;

  // Find max values for scaling
  const maxPurchase = useMemo(
    () => Math.max(...monthlyPurchases, 1000),
    [monthlyPurchases],
  );

  const maxOrders = useMemo(
    () => Math.max(...monthlyOrders, 100),
    [monthlyOrders],
  );

  // Generate SVG points for monthly orders line chart
  const ordersLinePoints = useMemo(() => {
    const xStep = chartWidth / (monthlyOrders.length - 1);
    return monthlyOrders
      .map((value, index) => {
        const x = index * xStep;
        const y = chartHeight - (value / maxOrders) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");
  }, [monthlyOrders, maxOrders]);

  // Top 5 products for display
  const topFiveProducts = useMemo(
    () => (Array.isArray(topProducts) ? topProducts.slice(0, 5) : []),
    [topProducts],
  );

  // Low stock products (highlight critical stock levels)
  const criticalStock = useMemo(
    () =>
      Array.isArray(lowStock)
        ? lowStock.filter((item) => Number(item.stock || 0) < 50)
        : [],
    [lowStock],
  );

  // Check admin access on mount
  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      const token = getAuthToken();

      if (!token) {
        router.replace("/auth/pages/login");
        return;
      }

      try {
        const response = await getCurrentUser();
        const currentRole = response?.user?.role || response?.data?.user?.role || response?.data?.role || "";

        if (!isAdminRole(currentRole)) {
          router.replace("/products");
          return;
        }

        if (isMounted) {
          setHasAccess(true);
          setIsAccessChecked(true);
        }
      } catch {
        router.replace("/auth/pages/login");
      }
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Show nothing while checking access
  if (!isAccessChecked || !hasAccess) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="p-3 sm:p-4 lg:p-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-blue-800/40 bg-linear-to-br from-[#0f1f56] via-[#101d48] to-[#061338] p-3 shadow-[0_24px_80px_rgba(3,10,35,0.55)] sm:p-4">
          <p className="text-sm text-slate-300">Loading dashboard...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-3 sm:p-4 lg:p-8">
        <div className="mx-auto max-w-6xl rounded-2xl border border-rose-800/40 bg-rose-950/30 p-3 shadow-[0_24px_80px_rgba(3,10,35,0.55)] sm:p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400" />
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-3 sm:p-4 lg:p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Dashboard</h1>

        {/* Finance Summary Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-blue-700/30 bg-linear-to-r from-[#3f4d8a]/75 to-[#2d3f7a]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
            <p className="text-sm font-semibold text-slate-200">Total Spend</p>
            <p className="mt-1 text-2xl font-extrabold text-white">{formatCurrency(finance.totalSpend)}</p>
          </article>

          <article className="rounded-xl border border-blue-700/30 bg-linear-to-r from-[#6f7f32]/75 to-[#2f4a6f]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
            <p className="text-sm font-semibold text-slate-200">Revenue</p>
            <p className="mt-1 text-2xl font-extrabold text-white">{formatCurrency(finance.revenue)}</p>
          </article>

          <article className="rounded-xl border border-blue-700/30 bg-linear-to-r from-[#3a7a5f]/75 to-[#2f4a6f]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
            <p className="text-sm font-semibold text-slate-200">Profit</p>
            <p className="mt-1 text-2xl font-extrabold text-white">{formatCurrency(finance.profit)}</p>
          </article>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Monthly Purchases Chart */}
          <article className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 sm:p-4">
            <h2 className="mb-3 text-lg font-semibold text-slate-100">Monthly Purchases</h2>

            <div className="grid grid-cols-[auto_1fr] gap-3">
              <div className="flex h-44 flex-col justify-between pb-5 text-xs font-medium text-slate-400">
                {[maxPurchase, maxPurchase * 0.75, maxPurchase * 0.5, maxPurchase * 0.25, 0].map(
                  (tick) => (
                    <span key={tick}>{formatCurrencyTick(tick)}</span>
                  ),
                )}
              </div>

              <div>
                <div className="relative flex h-44 items-end justify-between gap-1 border-l border-b border-slate-700/70 px-1 pb-1 sm:gap-1.5 sm:px-1.5">
                  {[maxPurchase * 0.75, maxPurchase * 0.5, maxPurchase * 0.25].map((line) => (
                    <div
                      key={line}
                      className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-700/60"
                      style={{ top: `${100 - (line / maxPurchase) * 100}%` }}
                    />
                  ))}

                  {monthlyPurchases.map((value, index) => (
                    <div key={months[index]} className="group flex h-full flex-1 items-end">
                      <div
                        className="w-full rounded-t bg-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.55)] transition duration-300 group-hover:bg-blue-400"
                        style={{ height: `${(value / maxPurchase) * 100}%` }}
                        title={`${months[index]}: ${formatCurrency(value)}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-12 text-center text-[11px] text-slate-400 sm:text-xs">
                  {months.map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Monthly Orders Chart */}
          <article className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 sm:p-4">
            <h2 className="mb-3 text-lg font-semibold text-slate-100">Monthly Orders</h2>

            <div className="overflow-x-auto">
              <div className="min-w-170">
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <div className="flex h-44 flex-col justify-between pb-5 text-xs font-medium text-slate-400">
                    {[maxOrders, maxOrders * 0.75, maxOrders * 0.5, maxOrders * 0.25, 0].map(
                      (tick) => (
                        <span key={tick}>{formatNumber(tick)}</span>
                      ),
                    )}
                  </div>

                  <div>
                    <div className="relative h-44 border-l border-b border-slate-700/70">
                      {[maxOrders * 0.75, maxOrders * 0.5, maxOrders * 0.25].map((line) => (
                        <div
                          key={line}
                          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-700/60"
                          style={{ top: `${100 - (line / maxOrders) * 100}%` }}
                        />
                      ))}

                      <svg
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        className="absolute inset-0 h-full w-full"
                        preserveAspectRatio="none"
                        role="img"
                        aria-label="Monthly orders line chart"
                      >
                        <defs>
                          <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                          </linearGradient>
                          <filter id="ordersLineGlow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        <polyline
                          points={`0,${chartHeight} ${ordersLinePoints} ${chartWidth},${chartHeight}`}
                          fill="url(#ordersFill)"
                          stroke="none"
                        />

                        <polyline
                          points={ordersLinePoints}
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#ordersLineGlow)"
                        />

                        {monthlyOrders.map((value, index) => {
                          const xStep = chartWidth / (monthlyOrders.length - 1);
                          const x = index * xStep;
                          const y = chartHeight - (value / maxOrders) * chartHeight;

                          return (
                            <circle
                              key={`${months[index]}-${value}`}
                              cx={x}
                              cy={y}
                              r="5"
                              fill="#f97316"
                              stroke="#0f172a"
                              strokeWidth="2"
                            />
                          );
                        })}
                      </svg>
                    </div>

                    <div className="mt-2 grid grid-cols-12 text-center text-[11px] text-slate-400 sm:text-xs">
                      {months.map((month) => (
                        <span key={month}>{month}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Top Products Section */}
        {topFiveProducts.length > 0 ? (
          <article className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 sm:p-4">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-slate-100">Top Products</h2>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-700/40 bg-slate-800/30">
              <table className="w-full text-left text-sm text-slate-200">
                <thead className="bg-slate-800/60 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3 text-right">Total Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {topFiveProducts.map((product, idx) => (
                    <tr key={`${product.productName}-${idx}`} className="border-t border-slate-700/40">
                      <td className="px-4 py-3 font-medium text-slate-100">{product.productName}</td>
                      <td className="px-4 py-3 text-right text-slate-100">
                        {formatNumber(product.totalSold)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ) : null}

        {/* Low Stock Section */}
        {criticalStock.length > 0 ? (
          <article className="rounded-xl border border-rose-700/40 bg-rose-950/30 p-3 sm:p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-400" />
              <h2 className="text-lg font-semibold text-rose-100">Low Stock Alert</h2>
            </div>

            <div className="space-y-2">
              {criticalStock.map((item, idx) => (
                <div
                  key={`${item.productName}-${idx}`}
                  className="flex items-center justify-between rounded-lg border border-rose-600/40 bg-rose-500/10 px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-rose-100">{item.productName}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      Number(item.stock) < 20
                        ? "bg-rose-600/50 text-rose-100"
                        : "bg-yellow-600/50 text-yellow-100"
                    }`}
                  >
                    {formatNumber(item.stock)} units
                  </span>
                </div>
              ))}
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}

