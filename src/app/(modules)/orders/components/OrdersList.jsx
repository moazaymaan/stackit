"use client";

// Purpose: This module handles orders logic and UI.

import { useOrders } from "../hooks/useOrders";

// Render the main orders component.
export default function OrdersList() {
  // Read orders data and actions from a custom hook.
  const { orders, isLoading, error } = useOrders();

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Order #</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Expected</th>
            <th className="px-4 py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{order.orderNumber}</td>
              <td className="px-4 py-3">{order.status}</td>
              <td className="px-4 py-3">{order.expectedDate}</td>
              <td className="px-4 py-3">${order.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

