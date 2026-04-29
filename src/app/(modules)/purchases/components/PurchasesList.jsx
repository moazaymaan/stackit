"use client";

// Purpose: This module handles purchases logic and UI.

import { usePurchases } from "../hooks/usePurchases";
import { ShoppingCart, Edit2, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react";

// Format currency amounts
function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

// Format dates in readable format
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

// Normalize status to readable label
function normalizeDisplayStatus(backendStatus) {
  const statusMap = {
    PENDING: "Pending",
    RECEIVED: "Received",
    IN_TRANSIT: "In Transit",
    DELIVERED: "Delivered",
  };
  const value = String(backendStatus || "PENDING").toUpperCase();
  return statusMap[value] || "Pending";
}

const getStatusIcon = (status) => {
  const normalizedStatus = normalizeDisplayStatus(status);
  switch (normalizedStatus) {
    case "Delivered":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "Pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
  }
};

// Render the main purchases component.
export default function PurchasesList() {
  // Read purchases data and actions from a custom hook.
  const { purchases, isLoading, error } = usePurchases();

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading purchases...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-3">
      {purchases.map((purchase) => (
        <article
          key={purchase.id}
          className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600 mt-0.5">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{purchase.supplierName || "Supplier"}</p>
                <p className="text-sm text-slate-600 mt-1">Status: 
                  <span className="inline-flex items-center gap-1 ml-2 font-medium">{getStatusIcon(purchase.status)} {normalizeDisplayStatus(purchase.status)}</span>
                </p>
                <p className="text-sm text-slate-600 mt-1">Amount: <span className="font-semibold text-slate-900">{formatMoney(purchase.totalAmount)}</span></p>
                <p className="text-xs text-slate-500 mt-1">{formatDate(purchase.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="inline-flex items-center rounded-md bg-teal-100 px-2 py-1 text-teal-700 hover:bg-teal-200" title="Edit">
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button className="inline-flex items-center rounded-md bg-rose-100 px-2 py-1 text-rose-700 hover:bg-rose-200" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
