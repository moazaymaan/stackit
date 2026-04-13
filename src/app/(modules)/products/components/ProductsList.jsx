"use client";

// Purpose: This module handles products logic and UI.

console.log("ProductsList component loaded");
import { useProducts } from "../hooks/useProducts";

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
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{product.sku}</td>
              <td className="px-4 py-3">{product.name}</td>
              <td className="px-4 py-3">{product.category}</td>
              <td className="px-4 py-3">${product.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

