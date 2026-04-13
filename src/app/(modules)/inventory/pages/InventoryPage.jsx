"use client";

// Purpose: This module handles inventory logic and UI.

import { useMemo } from "react";
import { useInventory } from "../hooks/useInventory";
import productsMock from "../../../../mock/products";

const productById = productsMock.reduce((lookup, product) => {
  lookup[product.id] = product;
  return lookup;
}, {});

// Render the main inventory component.
export default function InventoryPage() {
  // Read inventory data and actions from a custom hook.
  const { inventory, isLoading, error } = useInventory();

  // Compute derived inventory data from current state.
  const groupedInventory = useMemo(() => {
    const groups = inventory.reduce((acc, item) => {
      const warehouseName = item.warehouse || "Unassigned";
      const product = productById[item.productId] || {};
      const quantity = Number(item.quantity) || 0;
      const safetyStock = Number(item.safetyStock) || 0;

      if (!acc[warehouseName]) {
        acc[warehouseName] = [];
      }

      acc[warehouseName].push({
        ...item,
        sku: product.sku || item.productId || "-",
        name: product.name || "Unknown Item",
        location: warehouseName,
        status: quantity <= safetyStock ? "Low Stock" : "In Stock",
      });

      return acc;
    }, {});

    return Object.entries(groups);
  }, [inventory]);

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-blue-800/40 bg-linear-to-br from-[#0f1f56] via-[#101d48] to-[#061338] p-4 shadow-[0_24px_80px_rgba(3,10,35,0.55)] sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Inventory</h1>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-linear-to-r from-[#2d6dff] to-[#1ea0ff] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(33,118,255,0.35)] transition hover:brightness-110"
          >
            <span aria-hidden="true" className="text-base leading-none">
              +
            </span>
            Add Stock
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-300">Loading inventory...</p>
        ) : null}

        {!isLoading && error ? (
          <p className="text-sm text-rose-300">{error}</p>
        ) : null}

        {!isLoading && !error ? (
          <div className="space-y-3">
            {groupedInventory.map(([warehouseName, items]) => (
              <article
                key={warehouseName}
                className="overflow-hidden rounded-xl border border-blue-700/40 bg-[#0f1f4f]/70 backdrop-blur"
              >
                <div className="border-b border-blue-700/40 px-4 py-2.5 text-base font-semibold text-cyan-300">
                  {warehouseName}
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-slate-100">
                    <thead className="bg-[#0a1a45]/70 text-xs font-semibold uppercase tracking-wide text-slate-300">
                      <tr>
                        <th className="px-4 py-2.5">SKU</th>
                        <th className="px-4 py-2.5">Name</th>
                        <th className="px-4 py-2.5">Quantity</th>
                        <th className="px-4 py-2.5">Location</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-t border-blue-800/45">
                          <td className="whitespace-nowrap px-4 py-2.5 text-slate-100">{item.sku}</td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-slate-100">{item.name}</td>
                          <td className="px-4 py-2.5 text-slate-100">{item.quantity}</td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-slate-200">{item.location}</td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
                                item.status === "Low Stock"
                                  ? "bg-rose-600/90 text-rose-50"
                                  : "bg-emerald-600/90 text-emerald-50"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-md bg-cyan-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-cyan-500"
                              >
                                Edit
                              </button>
                              {item.status === "Low Stock" ? (
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 rounded-md bg-fuchsia-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-fuchsia-500"
                                >
                                  Transfer
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-500"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

