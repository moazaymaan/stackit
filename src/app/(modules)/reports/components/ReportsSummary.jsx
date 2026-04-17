"use client";

// Purpose: This module handles reports logic and UI.

import { useReportSummary } from "../hooks/useReportSummary";
import { Package, Boxes, Clock, CheckCircle2 } from "lucide-react";

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
      <article className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Products</p>
            <p className="text-2xl font-bold mt-1">{summary.totalProducts}</p>
          </div>
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <Package className="h-6 w-6" />
          </div>
        </div>
      </article>
      <article className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Inventory Units</p>
            <p className="text-2xl font-bold mt-1">{summary.totalInventoryUnits}</p>
          </div>
          <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
            <Boxes className="h-6 w-6" />
          </div>
        </div>
      </article>
      <article className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Open Orders</p>
            <p className="text-2xl font-bold mt-1">{summary.openOrders}</p>
          </div>
          <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>
      </article>
      <article className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Delivered Orders</p>
            <p className="text-2xl font-bold mt-1">{summary.deliveredOrders}</p>
          </div>
          <div className="rounded-lg bg-green-100 p-3 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </article>
    </div>
  );
}

