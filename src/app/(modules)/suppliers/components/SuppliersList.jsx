"use client";

// Purpose: This module handles suppliers logic and UI.

import { Edit2, Eye, Trash2 } from "lucide-react";

// Render the main suppliers component.
export default function SuppliersList({
  suppliers,
  isLoading,
  error,
  isSubmitting,
  canRead,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}) {
  const hasActions = canRead || canUpdate || canDelete;

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading suppliers...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!suppliers.length) {
    return <p className="text-sm text-slate-600">No suppliers found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Supplier</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Phone</th>
            
            {hasActions ? <th className="px-4 py-3 text-right">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{supplier.name}</td>
              <td className="px-4 py-3">{supplier.address || "-"}</td>
              <td className="px-4 py-3">{supplier.phone || "-"}</td>
            
              {hasActions ? (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {canRead ? (
                      <button
                        type="button"
                        onClick={() => onView?.(supplier)}
                        disabled={isSubmitting}
                        className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-indigo-500 px-2 text-xs text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                        title="View supplier"
                        aria-label="View supplier"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    ) : null}

                    {canUpdate ? (
                      <button
                        type="button"
                        onClick={() => onEdit?.(supplier)}
                        disabled={isSubmitting}
                        className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-teal-500 px-2 text-xs text-white transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
                        title="Edit supplier"
                        aria-label="Edit supplier"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    ) : null}

                    {canDelete ? (
                      <button
                        type="button"
                        onClick={() => onDelete?.(supplier)}
                        disabled={isSubmitting}
                        className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-rose-500 px-2 text-xs text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                        title="Delete supplier"
                        aria-label="Delete supplier"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

