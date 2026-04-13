"use client";

// Purpose: This module handles reports logic and UI.

import { useReportSummary } from "../hooks/useReportSummary";

// Render the main reports component.
export default function ReportsSummary() {
  // Read reports data and actions from a custom hook.
  const { summary, isLoading, error } = useReportSummary();

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading report summary...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Products</p>
        <p className="text-xl font-semibold">{summary.totalProducts}</p>
      </article>
      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Inventory Units</p>
        <p className="text-xl font-semibold">{summary.totalInventoryUnits}</p>
      </article>
      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Open Orders</p>
        <p className="text-xl font-semibold">{summary.openOrders}</p>
      </article>
      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Delivered Orders</p>
        <p className="text-xl font-semibold">{summary.deliveredOrders}</p>
      </article>
    </div>
  );
}

