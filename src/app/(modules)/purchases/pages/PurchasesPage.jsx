"use client";

// Purpose: This module handles purchases logic and UI.

import { useMemo } from "react";
import { usePurchases } from "../hooks/usePurchases";
import ordersMock from "../../../../mock/orders";
import suppliersMock from "../../../../mock/suppliers";

const supplierNameById = suppliersMock.reduce((lookup, supplier) => {
  lookup[supplier.id] = supplier.name;
  return lookup;
}, {});

const orderById = ordersMock.reduce((lookup, order) => {
  lookup[order.id] = order;
  return lookup;
}, {});

const boardColumns = ["Pending", "In Progress", "Completed"];

// Process helper logic for purchases data and behavior.
function normalizeStatus(status) {
  const value = String(status || "").toLowerCase();

  if (value.includes("pending")) {
    return "Pending";
  }

  if (value.includes("delivered") || value.includes("complete")) {
    return "Completed";
  }

  if (value.includes("transit") || value.includes("progress")) {
    return "In Progress";
  }

  return "Pending";
}

// Process helper logic for purchases data and behavior.
function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

// Process helper logic for purchases data and behavior.
function formatBoardDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

// Render the main purchases component.
export default function PurchasesPage() {
  // Read purchases data and actions from a custom hook.
  const { purchases, isLoading, error } = usePurchases();

  // Compute derived purchases data from current state.
  const purchaseCards = useMemo(() => {
    return purchases.map((purchase) => {
      const order = orderById[purchase.id] || {};
      const supplierName = supplierNameById[order.supplierId] || "Unknown Supplier";

      return {
        ...purchase,
        poNumber: purchase.reference || order.orderNumber || "PO-Unknown",
        supplierName,
        date: order.createdAt || purchase.expectedDate || "-",
        amount: Number(purchase.amount) || 0,
        normalizedStatus: normalizeStatus(purchase.status),
      };
    });
  }, [purchases]);

  // Compute derived purchases data from current state.
  const totalPurchasesThisMonth = useMemo(() => {
    const now = new Date();
    const targetMonth = now.getMonth();
    const targetYear = now.getFullYear();

    return purchaseCards.reduce((sum, purchase) => {
      const purchaseDate = new Date(purchase.date);
      const isSameMonth =
        !Number.isNaN(purchaseDate.getTime()) &&
        purchaseDate.getMonth() === targetMonth &&
        purchaseDate.getFullYear() === targetYear;

      return isSameMonth ? sum + purchase.amount : sum;
    }, 0);
  }, [purchaseCards]);

  // Compute derived purchases data from current state.
  const pendingOrders = useMemo(() => {
    return purchaseCards.filter((purchase) => purchase.normalizedStatus === "Pending").length;
  }, [purchaseCards]);

  // Compute derived purchases data from current state.
  const completedOrders = useMemo(() => {
    return purchaseCards.filter((purchase) => purchase.normalizedStatus === "Completed").length;
  }, [purchaseCards]);

  // Compute derived purchases data from current state.
  const totalSpend = useMemo(() => {
    return purchaseCards.reduce((sum, purchase) => sum + purchase.amount, 0);
  }, [purchaseCards]);

  // Compute derived purchases data from current state.
  const boardData = useMemo(() => {
    return {
      Pending: purchaseCards.filter((purchase) => purchase.normalizedStatus === "Pending"),
      "In Progress": purchaseCards.filter((purchase) => purchase.normalizedStatus === "In Progress"),
      Completed: purchaseCards.filter((purchase) => purchase.normalizedStatus === "Completed"),
    };
  }, [purchaseCards]);

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl rounded-[44px] border border-blue-900/60 bg-linear-to-br from-[#061330] via-[#0b1b48] to-[#06163f] p-4 shadow-[0_40px_100px_rgba(2,8,35,0.75)] sm:p-6">
        <div className="mb-4 border-b border-blue-800/35 pb-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Purchases</h1>
        </div>

        <div className="mb-5 flex justify-center">
          <button
            type="button"
            className="inline-flex min-w-68 items-center justify-center rounded-md bg-linear-to-r from-[#2d6dff] to-[#1bd6d1] px-5 py-2.5 text-base font-bold text-white shadow-[0_10px_26px_rgba(38,146,255,0.36)] transition hover:brightness-110"
          >
            Create Purchase Order
          </button>
        </div>

        {isLoading ? <p className="mb-4 text-sm text-slate-300">Loading purchases...</p> : null}
        {!isLoading && error ? <p className="mb-4 text-sm text-rose-300">{error}</p> : null}

        {!isLoading && !error ? (
          <>
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-md border border-blue-700/30 bg-linear-to-r from-[#3f4d8a]/75 to-[#2d3f7a]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
                <div className="flex items-center gap-2">
            
                  <p className="text-sm font-semibold text-slate-200">Total Purchases This Month</p>
                </div>
                <p className="mt-1 pl-6 text-3xl font-extrabold leading-none text-white">
                  {formatMoney(totalPurchasesThisMonth)}
                </p>
              </article>

              <article className="rounded-md border border-blue-700/30 bg-linear-to-r from-[#8e5a2f]/75 to-[#3a3b62]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
                <div className="flex items-center gap-2">
                
                  <p className="text-sm font-semibold text-slate-200">Pending Orders</p>
                </div>
                <p className="mt-1 pl-6 text-3xl font-extrabold leading-none text-white">{pendingOrders}</p>
              </article>

              <article className="rounded-md border border-blue-700/30 bg-linear-to-r from-[#3a7a5f]/75 to-[#2f4a6f]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
                <div className="flex items-center gap-2">
      
                  <p className="text-sm font-semibold text-slate-200">Completed Orders</p>
                </div>
                <p className="mt-1 pl-6 text-3xl font-extrabold leading-none text-white">{completedOrders}</p>
              </article>

              <article className="rounded-md border border-blue-700/30 bg-linear-to-r from-[#6f7f32]/75 to-[#2f4a6f]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
                <div className="flex items-center gap-2">
                 
                  <p className="text-sm font-semibold text-slate-200">Total Spend</p>
                </div>
                <p className="mt-1 pl-6 text-3xl font-extrabold leading-none text-white">{formatMoney(totalSpend)}</p>
              </article>
            </div>

            <div className="border-y border-blue-800/35 py-2">
              <div className="overflow-x-auto pb-1">
                <div className="grid min-w-240 grid-cols-3 gap-3 lg:min-w-0">
                  {boardColumns.map((column) => (
                    <section key={column}>
                      <header className="mb-3 border-b border-blue-800/35 pb-1.5">
                        <div className="flex items-center justify-center gap-2">
                          <h2 className="text-3xl font-extrabold text-slate-100 md:text-2xl">{column}</h2>
                          <span className="rounded-full bg-[#1a3167]/90 px-2 py-0.5 text-xs font-semibold text-slate-100">
                            {boardData[column].length}
                          </span>
                        </div>
                      </header>

                      <div className="space-y-2.5">
                        {boardData[column].map((purchase) => (
                          <article
                            key={purchase.id}
                            className="min-h-34 rounded-md border border-blue-700/35 bg-linear-to-b from-[#162d63]/90 to-[#112754]/88 px-4 py-3 shadow-[0_10px_22px_rgba(0,0,0,0.33)]"
                          >
                            <div className="mb-1.5 flex items-start justify-between gap-3">
                              <p className="text-base font-extrabold text-sky-300">{purchase.poNumber}</p>
                              <p className="text-[28px] font-extrabold leading-none text-slate-100 md:text-xl">
                                {formatMoney(purchase.amount)}
                              </p>
                            </div>

                            <p className="text-sm font-semibold text-slate-100">{purchase.supplierName}</p>

                            <div className="mt-2 border-t border-blue-700/35 pt-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm text-slate-300">{formatBoardDate(purchase.date)}</span>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    className="inline-flex h-6 min-w-7 items-center justify-center rounded-sm bg-teal-500 px-1.5 text-xs text-white transition hover:bg-teal-400"
                                    aria-label="Edit purchase order"
                                    title="Edit"
                                  >
                                    âœï¸
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex h-6 min-w-7 items-center justify-center rounded-sm bg-rose-500 px-1.5 text-xs text-white transition hover:bg-rose-400"
                                    aria-label="Delete purchase order"
                                    title="Delete"
                                  >
                                    ðŸ—‘ï¸
                                  </button>
                                  <button
                                    type="button"
                                    className="inline-flex h-6 min-w-7 items-center justify-center rounded-sm bg-blue-500 px-1.5 text-xs text-white transition hover:bg-blue-400"
                                    aria-label="View purchase order"
                                    title="View"
                                  >
                                    ðŸ‘ï¸
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}

                        {boardData[column].length === 0 ? (
                          <p className="rounded-md border border-dashed border-blue-700/40 bg-[#102250]/45 px-3 py-3 text-center text-xs text-slate-300">
                            No orders in this stage.
                          </p>
                        ) : null}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

