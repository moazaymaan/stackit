"use client";

// Purpose: This module handles suppliers logic and UI.

import { useSuppliers } from "../hooks/useSuppliers";

// Render the main suppliers component.
export default function SuppliersList() {
  // Read suppliers data and actions from a custom hook.
  const { suppliers, isLoading, error } = useSuppliers();

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading suppliers...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Supplier</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Lead Time</th>
            <th className="px-4 py-3">Rating</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{supplier.name}</td>
              <td className="px-4 py-3">{supplier.contactEmail}</td>
              <td className="px-4 py-3">{supplier.leadTimeDays} days</td>
              <td className="px-4 py-3">{supplier.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

