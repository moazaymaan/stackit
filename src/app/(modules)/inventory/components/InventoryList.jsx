"use client";

// Purpose: This module handles inventory logic and UI.

import { useInventory } from "../hooks/useInventory";
import { Boxes } from "lucide-react";

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
          className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Boxes className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500">Warehouse</p>
              <p className="font-medium">{item.warehouse}</p>
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-slate-50 p-2">
            <p className="text-sm font-semibold text-slate-700">Qty: {item.quantity}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

