// Purpose: This module handles reports logic and UI.

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthlyPurchases = [9000, 12000, 14500, 11000, 17200, 19300, 20800, 18600, 22100, 23800, 21000, 24600];

const supplierSegments = [
  { label: "Electronics", value: 35, color: "#3b82f6" },
  { label: "Office Supplies", value: 25, color: "#f97316" },
  { label: "Raw Materials", value: 20, color: "#22c55e" },
  { label: "Other", value: 20, color: "#a855f7" },
];

const inventoryTrend = [
  420, 510, 480, 560, 610, 680, 740, 710, 790, 860, 910, 970,
];

const MAX_PURCHASE = 25000;
const MAX_INVENTORY = 1000;

// Process helper logic for reports data and behavior.
function formatCurrencyTick(value) {
  if (value === 0) {
    return "$0";
  }

  return `$${value / 1000}k`;
}

// Render the main reports component.
export default function ReportsPage() {
  const chartHeight = 180;
  const chartWidth = 900;
  const xStep = chartWidth / (inventoryTrend.length - 1);

  const linePoints = inventoryTrend
    .map((value, index) => {
      const x = index * xStep;
      const y = chartHeight - (value / MAX_INVENTORY) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="p-3 sm:p-4 lg:h-[calc(100vh-90px)] lg:overflow-hidden lg:p-4">
      <div className="mx-auto flex h-full max-w-6xl flex-col rounded-2xl border border-blue-800/40 bg-linear-to-br from-[#0f1f56] via-[#101d48] to-[#061338] p-3 shadow-[0_24px_80px_rgba(3,10,35,0.55)] sm:p-4">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Reports</h1>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 sm:p-4">
            <h2 className="mb-3 text-lg font-semibold text-slate-100">Monthly Purchases</h2>

            <div className="grid grid-cols-[auto_1fr] gap-3">
              <div className="flex h-44 flex-col justify-between pb-5 text-xs font-medium text-slate-400">
                {[25000, 20000, 15000, 10000, 5000, 0].map((tick) => (
                  <span key={tick}>{formatCurrencyTick(tick)}</span>
                ))}
              </div>

              <div>
                <div className="relative flex h-44 items-end justify-between gap-1 border-l border-b border-slate-700/70 px-1 pb-1 sm:gap-1.5 sm:px-1.5">
                  {[25000, 20000, 15000, 10000, 5000].map((line) => (
                    <div
                      key={line}
                      className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-700/60"
                      style={{ top: `${100 - (line / MAX_PURCHASE) * 100}%` }}
                    />
                  ))}

                  {monthlyPurchases.map((value, index) => (
                    <div key={months[index]} className="group flex h-full flex-1 items-end">
                      <div
                        className="w-full rounded-t bg-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.55)] transition duration-300 group-hover:bg-blue-400"
                        style={{ height: `${(value / MAX_PURCHASE) * 100}%` }}
                        title={`${months[index]}: $${value.toLocaleString()}`}
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

          <article className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 sm:p-4">
            <h2 className="mb-3 text-lg font-semibold text-slate-100">Supplier Distribution</h2>

            <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,180px)_1fr]">
              <div className="mx-auto aspect-square w-full max-w-45 rounded-full border border-slate-700/70 shadow-[0_0_24px_rgba(15,23,42,0.7)]"
                style={{
                  background:
                    "conic-gradient(#3b82f6 0% 35%, #f97316 35% 60%, #22c55e 60% 80%, #a855f7 80% 100%)",
                }}
                aria-label="Supplier distribution pie chart"
              />

              <ul className="space-y-2">
                {supplierSegments.map((segment) => (
                  <li
                    key={segment.label}
                    className="flex items-center justify-between rounded-lg border border-slate-700/70 bg-slate-800/50 px-3 py-1.5"
                  >
                    <span className="inline-flex items-center gap-2 text-sm text-slate-200">
                      <span
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: segment.color }}
                        aria-hidden
                      />
                      {segment.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-100">{segment.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        <article className="mt-3 rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 sm:p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-100">Inventory Trends</h2>

          <div className="overflow-x-auto">
            <div className="min-w-170">
              <div className="grid grid-cols-[auto_1fr] gap-3">
                <div className="flex h-44 flex-col justify-between pb-5 text-xs font-medium text-slate-400">
                  {[1000, 800, 600, 400, 200, 0].map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>

                <div>
                  <div className="relative h-44 border-l border-b border-slate-700/70">
                    {[1000, 800, 600, 400, 200].map((line) => (
                      <div
                        key={line}
                        className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-700/60"
                        style={{ top: `${100 - (line / MAX_INVENTORY) * 100}%` }}
                      />
                    ))}

                    <svg
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      className="absolute inset-0 h-full w-full"
                      preserveAspectRatio="none"
                      role="img"
                      aria-label="Inventory trend line chart"
                    >
                      <defs>
                        <linearGradient id="inventoryFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                        </linearGradient>
                        <filter id="lineGlow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      <polyline
                        points={`0,${chartHeight} ${linePoints} ${chartWidth},${chartHeight}`}
                        fill="url(#inventoryFill)"
                        stroke="none"
                      />

                      <polyline
                        points={linePoints}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#lineGlow)"
                      />

                      {inventoryTrend.map((value, index) => {
                        const x = index * xStep;
                        const y = chartHeight - (value / MAX_INVENTORY) * chartHeight;

                        return (
                          <circle
                            key={`${months[index]}-${value}`}
                            cx={x}
                            cy={y}
                            r="5"
                            fill="#22d3ee"
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
    </section>
  );
}

