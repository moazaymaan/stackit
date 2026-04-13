"use client";

// Purpose: This module handles purchases logic and UI.

import { usePurchases } from "../hooks/usePurchases";

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
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <p className="text-sm font-medium">{purchase.reference}</p>
          <p className="text-sm text-slate-600">Status: {purchase.status}</p>
          <p className="text-sm text-slate-600">Amount: ${purchase.amount}</p>
        </article>
      ))}
    </div>
  );
}

