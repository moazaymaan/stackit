"use client";

// Purpose: This module handles inventory logic and UI.

import { useInventory } from "../hooks/useInventory";

// Render the main inventory component.
export default function InventoryList() {
  // Read inventory data and actions from a custom hook.
  const { inventory, isLoading, error } = useInventory();

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading inventory...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {inventory.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <p className="text-xs text-slate-500">Warehouse</p>
          <p className="font-medium">{item.warehouse}</p>
          <p className="mt-3 text-sm">Qty: {item.quantity}</p>
        </article>
      ))}
    </div>
  );
}

