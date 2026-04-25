"use client";

// Purpose: This module handles inventory logic and UI.

import { useMemo, useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { Boxes, RefreshCw, Search } from "lucide-react";

// Render the main inventory component.
export default function InventoryList() {
  // Read inventory data and actions from a custom hook.
  const { inventory, isLoading, error, refresh } = useInventory();
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("quantity-desc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = inventory.filter((item) => item.quantity <= item.safetyStock).length;
  const warehouseCount = new Set(inventory.map((item) => item.warehouse)).size;
  const healthyRate = inventory.length === 0 ? 0 : Math.round(((inventory.length - lowStockCount) / inventory.length) * 100);

  const filteredInventory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let rows = inventory.filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        item.warehouse.toLowerCase().includes(normalizedQuery) ||
        item.productId.toLowerCase().includes(normalizedQuery)
      );
    });

    rows = rows.filter((item) => {
      const isLowStock = item.quantity <= item.safetyStock;

      if (stockFilter === "low") {
        return isLowStock;
      }

      if (stockFilter === "healthy") {
        return !isLowStock;
      }

      return true;
    });

    rows.sort((a, b) => {
      if (sortBy === "quantity-asc") {
        return a.quantity - b.quantity;
      }

      if (sortBy === "warehouse-asc") {
        return a.warehouse.localeCompare(b.warehouse);
      }

      return b.quantity - a.quantity;
    });

    return rows;
  }, [inventory, query, stockFilter, sortBy]);

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
            <p className="mt-1 text-sm text-slate-300">Live stock levels across all warehouses</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Total Quantity</p>
              <p className="text-2xl font-extrabold text-cyan-100">{totalQuantity}</p>
            </div>
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">Low Stock Items</p>
              <p className="text-2xl font-extrabold text-amber-100">{lowStockCount}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Healthy Rate</p>
              <p className="text-2xl font-extrabold text-emerald-100">{healthyRate}%</p>
            </div>
          </div>
        </div>

        <div className="mb-4 grid gap-3 rounded-2xl border border-blue-800/35 bg-[#0a1a45]/65 p-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search warehouse or product id"
              className="w-full rounded-lg border border-blue-700/45 bg-[#071536] pl-9 pr-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            />
          </div>

          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="rounded-lg border border-blue-700/45 bg-[#071536] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
          >
            <option value="all">All Stocks</option>
            <option value="healthy">Healthy Only</option>
            <option value="low">Low Stock Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-lg border border-blue-700/45 bg-[#071536] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
          >
            <option value="quantity-desc">Sort: Qty high to low</option>
            <option value="quantity-asc">Sort: Qty low to high</option>
            <option value="warehouse-asc">Sort: Warehouse A-Z</option>
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
          <span>{filteredInventory.length}</span> items shown across <span>{warehouseCount}</span> warehouses
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInventory.map((item) => {
            const isLowStock = item.quantity <= item.safetyStock;
            const stockProgress = Math.min(
              100,
              Math.round((item.quantity / Math.max(item.safetyStock, 1)) * 100)
            );

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-blue-700/45 bg-linear-to-br from-[#122b61]/80 via-[#102653]/80 to-[#0d1d46]/85 p-4 shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-cyan-400/45"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-400/15 p-2 text-cyan-300">
                      <Boxes className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Warehouse</p>
                      <p className="text-lg font-bold text-slate-100">{item.warehouse}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      isLowStock
                        ? "bg-amber-500/25 text-amber-200"
                        : "bg-emerald-500/25 text-emerald-200"
                    }`}
                  >
                    {isLowStock ? "Low" : "Healthy"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-blue-700/40 bg-[#0a1a45]/70 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Quantity</p>
                    <p className="text-2xl font-extrabold text-cyan-200">{item.quantity}</p>
                  </div>
                  <div className="rounded-lg border border-blue-700/40 bg-[#0a1a45]/70 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Safety Stock</p>
                    <p className="text-2xl font-extrabold text-slate-200">{item.safetyStock}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
                    <span>Stock Coverage</span>
                    <span>{stockProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/70">
                    <div
                      className={`h-2 rounded-full ${
                        isLowStock ? "bg-amber-400" : "bg-emerald-400"
                      }`}
                      style={{ width: `${stockProgress}%` }}
                    />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">Product ID: {item.productId}</p>
              </article>
            );
          })}
        </div>

        {filteredInventory.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-700/45 bg-[#0b1c47]/55 px-4 py-8 text-center">
            <p className="text-sm text-slate-300">No inventory entries match your filters.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

