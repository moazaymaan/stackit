"use client";
// Purpose: This module handles products logic and UI.


import { useProducts } from "../hooks/useProducts";
import { Package, Edit2, Trash2 } from "lucide-react";

// Render the main products component.
export default function ProductsList() {
  // Read products data and actions from a custom hook.
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading products...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3"></th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-400"><Package className="h-4 w-4" /></td>
              <td className="px-4 py-3">{product.sku}</td>
              <td className="px-4 py-3 font-medium">{product.name}</td>
              <td className="px-4 py-3 font-semibold">${product.unitPrice}</td>
              <td className="flex gap-2 px-4 py-3">
                <button className="inline-flex items-center gap-1.5 rounded-md bg-teal-100 px-2 py-1 text-xs text-teal-700 hover:bg-teal-200" title="Edit">
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md bg-rose-100 px-2 py-1 text-xs text-rose-700 hover:bg-rose-200" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

