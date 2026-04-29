"use client";

// Purpose: This module handles orders logic and UI.

import { useMemo, useState } from "react";
import { CheckCheck, Eye, Plus, RefreshCw, ShoppingCart, X } from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import { useProducts } from "../../products/hooks/useProducts";

const statusOptions = ["All Status", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

// Process helper logic for orders data and behavior.
function normalizeOrderStatus(status) {
  const value = String(status || "").toLowerCase();

  if (value.includes("pending")) {
    return "PENDING";
  }

  if (value.includes("confirm")) {
    return "CONFIRMED";
  }

  if (value.includes("ship") || value.includes("transit")) {
    return "SHIPPED";
  }

  if (value.includes("deliver")) {
    return "DELIVERED";
  }

  return String(status || "").toUpperCase() || "PENDING";
}

// Process helper logic for orders data and behavior.
function getStatusBadgeStyle(status) {
  switch (status) {
    case "PENDING":
      return "bg-amber-500 text-amber-50";
    case "CONFIRMED":
      return "bg-cyan-500 text-cyan-50";
    case "SHIPPED":
      return "bg-blue-500 text-blue-50";
    case "DELIVERED":
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
  const {
    orders,
    isLoading,
    isSubmitting,
    error,
    errorDetails,
    successMessage,
    clearMessages,
    refresh,
    createOrder,
    confirmOrder,
    getOrderById,
    selectedOrder,
    setSelectedOrder,
    canConfirm,
  } = useOrders();
  const { products } = useProducts();
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [customerQuery, setCustomerQuery] = useState("");
  const [modalType, setModalType] = useState("");
  const [formError, setFormError] = useState("");
  const [formValues, setFormValues] = useState({
    customerName: "",
    items: [{ productId: "", quantity: 1, price: 0 }],
  });

  const productById = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      const id = product?.id || product?._id;
      if (id) {
        map.set(String(id), product);
      }
    });
    return map;
  }, [products]);

  const closeModal = () => {
    setModalType("");
    setFormError("");
    clearMessages();
  };

  const openCreateModal = () => {
    setFormValues({
      customerName: "",
      items: [{ productId: "", quantity: 1, price: 0 }],
    });
    setFormError("");
    clearMessages();
    setModalType("create");
  };

  const openViewModal = async (orderId) => {
    try {
      clearMessages();
      await getOrderById(orderId);
      setModalType("view");
    } catch {
      // error is surfaced via hook state
    }
  };

  const validateCreateForm = () => {
    if (!formValues.customerName.trim()) {
      setFormError("Customer name is required.");
      return false;
    }

    if (!Array.isArray(formValues.items) || formValues.items.length === 0) {
      setFormError("At least one item is required.");
      return false;
    }

    for (const [index, item] of formValues.items.entries()) {
      if (!String(item.productId || "").trim()) {
        setFormError(`Item ${index + 1}: product is required.`);
        return false;
      }
      if (!Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0) {
        setFormError(`Item ${index + 1}: quantity must be greater than 0.`);
        return false;
      }
      if (!Number.isFinite(Number(item.price)) || Number(item.price) < 0) {
        setFormError(`Item ${index + 1}: price must be 0 or greater.`);
        return false;
      }
    }

    setFormError("");
    return true;
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    if (!validateCreateForm()) {
      return;
    }

    try {
      await createOrder({
        customerName: formValues.customerName.trim(),
        items: formValues.items.map((item) => ({
          productId: String(item.productId).trim(),
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      });
      closeModal();
    } catch {
      // error surfaced via hook
    }
  };

  const handleConfirm = async (orderId) => {
    try {
      await confirmOrder(orderId);
    } catch {
      // error surfaced via hook
    }
  };

  // Compute derived orders data from current state.
  const ordersWithEnrichedData = useMemo(() => {
    return orders.map((order) => {
      const normalizedStatus = normalizeOrderStatus(order.status);
      const productNames = (order.items || []).map((item) => {
        const product = productById.get(String(item.productId)) || null;
        return product?.name || product?.title || item.productId;
      });

      return {
        ...order,
        productNames,
        normalizedStatus,
        sortDate: new Date(order.createdAt || 0),
      };
    });
  }, [orders, productById]);

  // Compute derived orders data from current state.
  const filteredOrders = useMemo(() => {
    return ordersWithEnrichedData.filter((order) => {
      const statusMatches = statusFilter === "All Status" || order.normalizedStatus === statusFilter;
      const normalizedCustomerQuery = customerQuery.trim().toLowerCase();
      const customerMatches = !normalizedCustomerQuery
        ? true
        : String(order.customerName || "").toLowerCase().includes(normalizedCustomerQuery);

      return statusMatches && customerMatches;
    });
  }, [ordersWithEnrichedData, statusFilter, customerQuery]);

  // Compute derived orders data from current state.
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
  }, [filteredOrders]);

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl rounded-[44px] border border-blue-900/60 bg-linear-to-br from-[#061330] via-[#0b1b48] to-[#06163f] p-4 shadow-[0_40px_100px_rgba(2,8,35,0.75)] sm:p-6">
        <div className="mb-4 border-b border-blue-800/35 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white">Orders</h1>
              <p className="mt-1 text-sm text-slate-300">Create, review, and confirm customer orders</p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              Create Order
            </button>
          </div>
        </div>

        {successMessage ? <p className="mb-3 text-sm text-emerald-300">{successMessage}</p> : null}
        {!isLoading && error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}
        {!isLoading && errorDetails?.productId ? (
          <p className="mb-3 text-sm text-rose-200/90">
            Product {errorDetails.productId}: requested {errorDetails.requested}, available {errorDetails.available}
          </p>
        ) : null}

        {isLoading ? <p className="mb-4 text-sm text-slate-300">Loading orders...</p> : null}

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

              <input
                value={customerQuery}
                onChange={(e) => setCustomerQuery(e.target.value)}
                placeholder="Filter by customer name"
                className="min-w-56 rounded-md border border-blue-700/40 bg-[#0f1f4f] px-3 py-1.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
              />

              <button
                type="button"
                onClick={refresh}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-md bg-linear-to-r from-[#2d7dff] to-[#1e9bff] px-6 py-1.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(45,130,255,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className="h-4 w-4" strokeWidth={2.2} />
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="rounded-lg border border-blue-800/40 bg-[#0a1640]/70 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {sortedOrders.map((order) => (
                    <article key={order.id} className="flex h-full w-full flex-col rounded-lg border border-blue-700/40 bg-linear-to-b from-[#1a3668]/85 to-[#0f1f4f]/80 p-4.5 shadow-[0_12px_28px_rgba(0,0,0,0.4)]">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[1.65rem] font-extrabold leading-none text-sky-300">
                          {order.customerName || "Order"}
                        </p>
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${getStatusBadgeStyle(order.normalizedStatus)}`}>
                          {order.normalizedStatus}
                        </span>
                      </div>

                      <p className="mt-2 text-lg font-bold text-slate-100">{order.id ? `ORD-${String(order.id).slice(-6)}` : "—"}</p>

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
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => openViewModal(order.id)}
                            disabled={isSubmitting}
                            className="inline-flex h-7 items-center justify-center gap-1 rounded-md bg-blue-500 px-2 text-[11px] font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          {canConfirm && order.normalizedStatus === "PENDING" ? (
                            <button
                              type="button"
                              onClick={() => handleConfirm(order.id)}
                              disabled={isSubmitting}
                              className="inline-flex h-7 items-center justify-center gap-1 rounded-md bg-emerald-500 px-2 text-[11px] font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                              title="Confirm order"
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                              Confirm
                            </button>
                          ) : (
                            <div />
                          )}
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

      {modalType === "create" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-blue-700/45 bg-[#0f1d47] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Create Order</h2>
                <p className="mt-1 text-sm text-slate-300">Build an order and submit to the backend</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md p-2 text-slate-200 transition hover:bg-white/5"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="mt-4 space-y-4" onSubmit={handleCreateSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-200">Customer name</label>
                <input
                  value={formValues.customerName}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, customerName: e.target.value }))}
                  className="w-full rounded-md border border-blue-600/50 bg-[#0b183d] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-200">Items</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues((prev) => ({
                        ...prev,
                        items: [...prev.items, { productId: "", quantity: 1, price: 0 }],
                      }))
                    }
                    className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4" />
                    Add item
                  </button>
                </div>

                <div className="space-y-2">
                  {formValues.items.map((item, idx) => {
                    const itemTotal = (Number(item.quantity) || 0) * (Number(item.price) || 0);
                    return (
                      <div
                        key={idx}
                        className="grid gap-2 rounded-xl border border-blue-700/35 bg-[#0b183d]/55 p-3 md:grid-cols-[1fr_120px_140px_auto]"
                      >
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Product
                          </label>
                          <select
                            value={item.productId}
                            onChange={(e) =>
                              setFormValues((prev) => ({
                                ...prev,
                                items: prev.items.map((row, rowIdx) =>
                                  rowIdx === idx ? { ...row, productId: e.target.value } : row,
                                ),
                              }))
                            }
                            className="w-full rounded-md border border-blue-600/50 bg-[#071536] px-2 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                          >
                            <option value="">Select product</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name || product.title || product.id}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Qty
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              setFormValues((prev) => ({
                                ...prev,
                                items: prev.items.map((row, rowIdx) =>
                                  rowIdx === idx ? { ...row, quantity: e.target.value } : row,
                                ),
                              }))
                            }
                            className="w-full rounded-md border border-blue-600/50 bg-[#071536] px-2 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Price
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={item.price}
                            onChange={(e) =>
                              setFormValues((prev) => ({
                                ...prev,
                                items: prev.items.map((row, rowIdx) =>
                                  rowIdx === idx ? { ...row, price: e.target.value } : row,
                                ),
                              }))
                            }
                            className="w-full rounded-md border border-blue-600/50 bg-[#071536] px-2 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                          />
                          <p className="mt-1 text-xs text-slate-400">Line: {formatMoney(itemTotal)}</p>
                        </div>

                        <div className="flex items-end justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setFormValues((prev) => ({
                                ...prev,
                                items: prev.items.filter((_, rowIdx) => rowIdx !== idx),
                              }))
                            }
                            disabled={formValues.items.length === 1}
                            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-500/60 px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-blue-700/35 bg-[#0b183d]/55 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-200">
                    <ShoppingCart className="h-4 w-4 text-slate-300" />
                    <span className="text-sm font-semibold">Estimated total</span>
                  </div>
                  <div className="text-lg font-extrabold text-cyan-200">
                    {formatMoney(
                      formValues.items.reduce(
                        (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
                        0,
                      ),
                    )}
                  </div>
                </div>
              </div>

              {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}
              {!formError && error ? <p className="text-sm text-rose-300">{error}</p> : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-500/70 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {modalType === "view" && selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-blue-700/45 bg-[#0f1d47] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  {selectedOrder.id ? `ORD-${String(selectedOrder.id).slice(-6)}` : "Order"}
                </h2>
                <p className="mt-1 text-sm text-slate-300">{selectedOrder.customerName}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  closeModal();
                }}
                className="rounded-md p-2 text-slate-200 transition hover:bg-white/5"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 rounded-xl border border-blue-700/35 bg-[#0b183d]/55 p-3 text-sm text-slate-200 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
                <p className="mt-1 inline-flex rounded-md px-2 py-1 text-xs font-bold text-white bg-slate-600/60">
                  {normalizeOrderStatus(selectedOrder.status)}
                </p>
              </div>
              <div className="text-right sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total</p>
                <p className="mt-1 text-lg font-extrabold text-cyan-200">{formatMoney(selectedOrder.totalAmount)}</p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-blue-700/35">
              <table className="w-full text-left text-sm text-slate-200">
                <thead className="bg-[#071536]/70 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item, idx) => {
                    const lineTotal = (Number(item.quantity) || 0) * (Number(item.price) || 0);
                    return (
                      <tr key={idx} className="border-t border-blue-800/35 bg-[#0a1640]/40">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-100">
                            {item.productName && item.productName !== "Product" ? item.productName : `Product (${item.productId})`}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold">{item.quantity}</td>
                        <td className="px-4 py-3">{formatMoney(item.price)}</td>
                        <td className="px-4 py-3 font-bold">{formatMoney(lineTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              {canConfirm && normalizeOrderStatus(selectedOrder.status) === "PENDING" ? (
                <button
                  type="button"
                  onClick={async () => {
                    await handleConfirm(selectedOrder.id);
                    setSelectedOrder(null);
                    closeModal();
                  }}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCheck className="h-4 w-4" />
                  Confirm
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  closeModal();
                }}
                className="rounded-md border border-slate-500/70 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

