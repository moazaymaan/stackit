"use client";

// Purpose: This module handles inventory logic and UI.

import { useMemo, useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { Boxes, CalendarClock, RefreshCw, Search, Tag } from "lucide-react";

function formatMovementSource(source) {
  const normalized = String(source || "").toUpperCase();

  if (normalized === "PURCHASE") {
    return "Purchase";
  }

  if (normalized === "ORDER") {
    return "Order";
  }

  return normalized ? normalized.charAt(0) + normalized.slice(1).toLowerCase() : "—";
}

// Render the main inventory component.
export default function InventoryList() {
  // Read inventory data and actions from a custom hook.
  const { balances, logs, isLoading, error, refresh } = useInventory();
  const [activeTab, setActiveTab] = useState("balances");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("onhand-desc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalOnHand = balances.reduce((sum, item) => sum + (Number(item.onHand ?? 0) || 0), 0);
  const productCount = balances.length;
  const movementsCount = logs.length;

  const filteredBalances = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let rows = balances.filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        String(item.productName || "").toLowerCase().includes(normalizedQuery) ||
        String(item.productSku || "").toLowerCase().includes(normalizedQuery) ||
        String(item.productId || "").toLowerCase().includes(normalizedQuery)
      );
    });

    rows.sort((a, b) => {
      if (sortBy === "onhand-asc") {
        return (Number(a.onHand ?? 0) || 0) - (Number(b.onHand ?? 0) || 0);
      }

      if (sortBy === "name-asc") {
        return String(a.productName || a.productId).localeCompare(String(b.productName || b.productId));
      }

      return (Number(b.onHand ?? 0) || 0) - (Number(a.onHand ?? 0) || 0);
    });

    return rows;
  }, [balances, query, sortBy]);

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let rows = logs.filter((log) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        String(log.productName || "").toLowerCase().includes(normalizedQuery) ||
        String(log.productSku || "").toLowerCase().includes(normalizedQuery) ||
        String(log.productId || "").toLowerCase().includes(normalizedQuery) ||
        String(log.referenceId || "").toLowerCase().includes(normalizedQuery) ||
        String(log.source || "").toLowerCase().includes(normalizedQuery)
      );
    });

    if (typeFilter !== "all") {
      rows = rows.filter((log) => String(log.type || "").toUpperCase() === typeFilter);
    }

    if (sourceFilter !== "all") {
      rows = rows.filter((log) => String(log.source || "").toUpperCase() === sourceFilter);
    }

    rows.sort((a, b) => {
      const left = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const right = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return right - left;
    });

    return rows;
  }, [logs, query, typeFilter, sourceFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-blue-900/55 bg-linear-to-br from-[#071333] via-[#081743] to-[#03102d] p-6 shadow-[0_40px_90px_rgba(2,8,35,0.7)]">
          <p className="text-sm text-slate-300">Loading inventory...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-rose-800/60 bg-rose-950/40 p-6">
          <p className="text-sm text-rose-300">{error}</p>
          <button
            type="button"
            onClick={handleRefresh}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-500/80 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl rounded-[42px] border border-blue-900/55 bg-linear-to-br from-[#061330] via-[#0a1a47] to-[#04112f] p-5 shadow-[0_40px_95px_rgba(2,8,35,0.75)] sm:p-6">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-800/45 bg-[#091b46]/60 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Inventory</h1>
            <p className="mt-1 text-sm text-slate-300">Backend inventory logs + computed balances</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Total On Hand</p>
              <p className="text-2xl font-extrabold text-cyan-100">{totalOnHand}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Products</p>
              <p className="text-2xl font-extrabold text-emerald-100">{productCount}</p>
            </div>
            <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">Movements</p>
              <p className="text-2xl font-extrabold text-indigo-100">{movementsCount}</p>
            </div>
          </div>
        </div>

        <div className="mb-4 grid gap-3 rounded-2xl border border-blue-800/35 bg-[#0a1a45]/65 p-3 md:grid-cols-[auto_1fr_auto_auto_auto] md:items-center">
          <div className="flex overflow-hidden rounded-lg border border-blue-700/45 bg-[#071536]">
            <button
              type="button"
              onClick={() => setActiveTab("balances")}
              className={`px-3 py-2 text-sm font-semibold transition ${
                activeTab === "balances" ? "bg-sky-500 text-slate-950" : "text-slate-200 hover:bg-white/5"
              }`}
            >
              Balances
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("logs")}
              className={`px-3 py-2 text-sm font-semibold transition ${
                activeTab === "logs" ? "bg-sky-500 text-slate-950" : "text-slate-200 hover:bg-white/5"
              }`}
            >
              Logs
            </button>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product, id, reference, source"
              className="w-full rounded-lg border border-blue-700/45 bg-[#071536] pl-9 pr-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            />
          </div>

          {activeTab === "logs" ? (
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-lg border border-blue-700/45 bg-[#071536] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            >
              <option value="all">All Types</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
            </select>
          ) : (
            <div />
          )}

          {activeTab === "logs" ? (
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="rounded-lg border border-blue-700/45 bg-[#071536] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            >
              <option value="all">All Sources</option>
              <option value="ORDER">ORDER</option>
              <option value="PURCHASE">PURCHASE</option>
            </select>
          ) : (
            <div />
          )}

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-lg border border-blue-700/45 bg-[#071536] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
          >
            {activeTab === "balances" ? (
              <>
                <option value="onhand-desc">Sort: On hand high to low</option>
                <option value="onhand-asc">Sort: On hand low to high</option>
                <option value="name-asc">Sort: Product name A-Z</option>
              </>
            ) : (
              <option value="date-desc">Sort: Newest first</option>
            )}
          </select>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-sky-500 to-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing" : "Refresh"}
          </button>
        </div>

        <div className="mb-4 text-sm text-slate-300">
          {activeTab === "balances" ? (
            <>
              <span>{filteredBalances.length}</span> products shown
            </>
          ) : (
            <>
              <span>{filteredLogs.length}</span> movements shown
            </>
          )}
        </div>

        {activeTab === "balances" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBalances.map((item) => (
                <article
                  key={item.productId}
                  className="rounded-2xl border border-blue-700/45 bg-linear-to-br from-[#122b61]/80 via-[#102653]/80 to-[#0d1d46]/85 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-cyan-400/45"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-cyan-400/15 p-2 text-cyan-300">
                        <Boxes className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Product</p>
                        <p className="text-lg font-bold text-slate-100">
                          {item.productName ? item.productName : (item.productSku ? item.productSku : `Product (${item.productId})`)}
                        </p>
                        {item.productSku && item.productName ? <p className="text-xs text-slate-400">{item.productSku}</p> : null}
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
                      On hand
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-blue-700/40 bg-[#0a1a45]/70 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">In</p>
                      <p className="text-xl font-extrabold text-emerald-200">{item.inQty}</p>
                    </div>
                    <div className="rounded-lg border border-blue-700/40 bg-[#0a1a45]/70 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Out</p>
                      <p className="text-xl font-extrabold text-rose-200">{item.outQty}</p>
                    </div>
                    <div className="rounded-lg border border-blue-700/40 bg-[#0a1a45]/70 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Balance</p>
                      <p className="text-xl font-extrabold text-cyan-200">{item.onHand}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-300">
                    <p className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-slate-400" />
                      <span>Last: {item.lastMovementAt ? new Date(item.lastMovementAt).toLocaleString() : "—"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-slate-400" />
                      <span>{formatMovementSource(item.lastSource)}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {filteredBalances.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-blue-700/45 bg-[#0b1c47]/55 px-4 py-8 text-center">
                <p className="text-sm text-slate-300">No products match your filters.</p>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-blue-800/35 bg-[#08163a]/50">
              <table className="w-full text-left text-sm text-slate-200">
                <thead className="bg-[#071536]/70 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-t border-blue-800/35">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-100">
                          {log.productName ? log.productName : (log.productSku ? log.productSku : `Product (${log.productId})`)}
                        </div>
                        {log.productSku && log.productName ? <div className="text-xs text-slate-400">{log.productSku}</div> : null}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-bold ${
                            String(log.type).toUpperCase() === "IN"
                              ? "bg-emerald-500/15 text-emerald-200"
                              : "bg-rose-500/15 text-rose-200"
                          }`}
                        >
                          {String(log.type || "—").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">{log.quantity}</td>
                      <td className="px-4 py-3">{log.source || "—"}</td>
                      <td className="px-4 py-3">{formatMovementSource(log.source)}</td>
                      <td className="px-4 py-3">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-blue-700/45 bg-[#0b1c47]/55 px-4 py-8 text-center">
                <p className="text-sm text-slate-300">No movements match your filters.</p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

