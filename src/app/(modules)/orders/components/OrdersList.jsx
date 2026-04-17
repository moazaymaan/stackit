"use client";

// Purpose: This module handles orders logic and UI.

import { useOrders } from "../hooks/useOrders";
import { ClipboardList, Edit2, Trash2, Eye } from "lucide-react";

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
            <th className="px-4 py-3"></th>
            <th className="px-4 py-3">Order #</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Expected</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-400"><ClipboardList className="h-4 w-4" /></td>
              <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3">{order.expectedDate}</td>
              <td className="px-4 py-3 font-semibold">${order.totalAmount}</td>
              <td className="flex gap-2 px-4 py-3">
                <button className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-blue-700 hover:bg-blue-200" title="View">
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button className="inline-flex items-center rounded-md bg-teal-100 px-2 py-1 text-teal-700 hover:bg-teal-200" title="Edit">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button className="inline-flex items-center rounded-md bg-rose-100 px-2 py-1 text-rose-700 hover:bg-rose-200" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

