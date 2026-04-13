"use client";

// Purpose: This module handles orders logic and UI.

import { useMemo, useState } from "react";
import { useOrders } from "../hooks/useOrders";
import suppliersMock from "../../../../mock/suppliers";
import productsMock from "../../../../mock/products";

const supplierNameById = suppliersMock.reduce((lookup, supplier) => {
  lookup[supplier.id] = supplier.name;
  return lookup;
}, {});

const productNameById = productsMock.reduce((lookup, product) => {
  lookup[product.id] = product.name;
  return lookup;
}, {});

const statusOptions = ["All Status", "Processing", "Shipped", "Delivered"];

// Process helper logic for orders data and behavior.
function normalizeOrderStatus(status) {
  const value = String(status || "").toLowerCase();

  if (value.includes("pending")) {
    return "Processing";
  }

  if (value.includes("transit")) {
    return "Shipped";
  }

  if (value.includes("delivered")) {
    return "Delivered";
  }

  return "Processing";
}

// Process helper logic for orders data and behavior.
function getStatusBadgeStyle(status) {
  switch (status) {
    case "Processing":
      return "bg-amber-500 text-amber-50";
    case "Shipped":
      return "bg-blue-500 text-blue-50";
    case "Delivered":
      return "bg-emerald-500 text-emerald-50";
    default:
      return "bg-slate-500 text-slate-50";
  }
}

// Process helper logic for orders data and behavior.
function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

// Render the main orders component.
export default function OrdersPage() {
  // Read orders data and actions from a custom hook.
  const { orders, isLoading, error } = useOrders();
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [customerFilter, setCustomerFilter] = useState("All Customers");

  // Compute derived orders data from current state.
  const ordersWithEnrichedData = useMemo(() => {
    return orders.map((order) => {
      const customerName = supplierNameById[order.supplierId] || "Unknown Customer";
      const productNames = (order.items || []).map((item) => productNameById[item.productId] || "Unknown Product");
      const normalizedStatus = normalizeOrderStatus(order.status);

      return {
        ...order,
        customerName,
        productNames,
        normalizedStatus,
        sortDate: new Date(order.createdAt),
      };
    });
  }, [orders]);

  // Compute derived orders data from current state.
  const uniqueCustomers = useMemo(() => {
    const customerSet = new Set(ordersWithEnrichedData.map((order) => order.customerName));
    return ["All Customers", ...Array.from(customerSet).sort()];
  }, [ordersWithEnrichedData]);

  // Compute derived orders data from current state.
  const filteredOrders = useMemo(() => {
    return ordersWithEnrichedData.filter((order) => {
      const statusMatches = statusFilter === "All Status" || order.normalizedStatus === statusFilter;
      const customerMatches = customerFilter === "All Customers" || order.customerName === customerFilter;

      return statusMatches && customerMatches;
    });
  }, [ordersWithEnrichedData, statusFilter, customerFilter]);

  // Compute derived orders data from current state.
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
  }, [filteredOrders]);

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl rounded-[44px] border border-blue-900/60 bg-linear-to-br from-[#061330] via-[#0b1b48] to-[#06163f] p-4 shadow-[0_40px_100px_rgba(2,8,35,0.75)] sm:p-6">
        <div className="mb-4 border-b border-blue-800/35 pb-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Orders</h1>
        </div>

        {isLoading ? <p className="mb-4 text-sm text-slate-300">Loading orders...</p> : null}
        {!isLoading && error ? <p className="mb-4 text-sm text-rose-300">{error}</p> : null}

        {!isLoading && !error ? (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-blue-700/40 bg-[#0f1f4f] px-3 py-1.5 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                id="customer-filter"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="rounded-md border border-blue-700/40 bg-[#0f1f4f] px-3 py-1.5 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
              >
                {uniqueCustomers.map((customer) => (
                  <option key={customer} value={customer}>
                    {customer}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="rounded-md bg-linear-to-r from-[#2d7dff] to-[#1e9bff] px-6 py-1.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(45,130,255,0.35)] transition hover:brightness-110"
              >
                Apply
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="rounded-lg border border-blue-800/40 bg-[#0a1640]/70 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {sortedOrders.map((order) => (
                    <article key={order.id} className="flex h-full w-full flex-col rounded-lg border border-blue-700/40 bg-linear-to-b from-[#1a3668]/85 to-[#0f1f4f]/80 p-4.5 shadow-[0_12px_28px_rgba(0,0,0,0.4)]">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[1.65rem] font-extrabold leading-none text-sky-300">{order.orderNumber}</p>
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${getStatusBadgeStyle(order.normalizedStatus)}`}>
                          {order.normalizedStatus}
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-bold text-slate-100">{order.customerName}</p>

                      <div className="mt-2.5 min-h-16 rounded-md bg-[#0c1d4a]/65 px-3 py-2 text-sm text-slate-200">
                        {order.productNames.slice(0, 2).map((name, i) => (
                          <p key={i}>{name}</p>
                        ))}
                        {order.productNames.length > 2 ? <p className="text-slate-400">+{order.productNames.length - 2} more</p> : null}
                      </div>

                      <div className="mt-2.5 flex items-end justify-between">
                        <span className="text-sm font-semibold uppercase tracking-wide text-slate-300">Total</span>
                        <span className="text-[1.75rem] font-extrabold leading-none text-cyan-300">{formatMoney(order.totalAmount)}</span>
                      </div>

                      <div className="mt-2.5 border-t border-blue-700/30 pt-2.5">
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            className="inline-flex h-7 items-center justify-center gap-1 rounded-md bg-teal-500 px-2 text-[11px] font-semibold text-white transition hover:bg-teal-400"
                            title="Edit"
                          >
                            <span aria-hidden="true">âœï¸</span>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-7 items-center justify-center gap-1 rounded-md bg-red-500 px-2 text-[11px] font-semibold text-white transition hover:bg-red-400"
                            title="Delete"
                          >
                            <span aria-hidden="true">ðŸ—‘ï¸</span>
                            Delete
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-7 items-center justify-center gap-1 rounded-md bg-blue-500 px-2 text-[11px] font-semibold text-white transition hover:bg-blue-400"
                            title="View"
                          >
                            <span aria-hidden="true">ðŸ‘ï¸</span>
                            View
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {sortedOrders.length === 0 ? (
                  <div className="rounded-md border border-dashed border-blue-700/40 bg-[#0f1640]/50 px-4 py-8 text-center">
                    <p className="text-sm text-slate-400">No orders match the selected filters.</p>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

