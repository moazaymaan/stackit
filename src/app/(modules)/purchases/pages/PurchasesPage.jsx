"use client";

// Purpose: This module handles purchases logic and UI.

import { useMemo, useState } from "react";
import {
  PlusCircle,
  CircleDollarSign,
  Clock3,
  CheckCircle2,
  BadgeDollarSign,
  AlertCircle,
  X,
  ChevronDown,
} from "lucide-react";
import { usePurchases } from "../hooks/usePurchases";

const BACKEND_STATUS_VALUES = ["PENDING", "RECEIVED"];
const STATUS_DISPLAY_MAP = {
  PENDING: "Pending",
  RECEIVED: "Received",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
};

const boardColumns = ["Pending", "Received"]; // Only show these columns

// Process helper logic for purchases data and behavior.
function normalizeDisplayStatus(backendStatus) {
  const value = String(backendStatus || "PENDING").toUpperCase();
  return STATUS_DISPLAY_MAP[value] || "Pending";
}

// Process helper logic for purchases data and behavior.
function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

// Process helper logic for purchases data and behavior.
function formatBoardDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

// Inline Create Purchase Modal Component
function CreatePurchaseModal({ isOpen, onClose, onSubmit, isSubmitting, suppliers = [], products = [] }) {
  const [formData, setFormData] = useState({
    supplierId: "",
    items: [{ productId: "", quantity: "", price: "" }],
  });
  const [errors, setErrors] = useState({});

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: "", price: "" }],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.supplierId.trim()) {
      newErrors.supplierId = "Supplier is required";
    }
    if (formData.items.length === 0) {
      newErrors.items = "At least one item is required";
    }
    formData.items.forEach((item, i) => {
      if (!item.productId.trim()) newErrors[`item_${i}_productId`] = "Product is required";
      if (!item.quantity || Number(item.quantity) <= 0)
        newErrors[`item_${i}_quantity`] = "Quantity must be > 0";
      if (!item.price || Number(item.price) <= 0)
        newErrors[`item_${i}_price`] = "Price must be > 0";
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      supplierId: formData.supplierId,
      items: formData.items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
    };

    onSubmit(payload)
      .then(() => {
        setFormData({ supplierId: "", items: [{ productId: "", quantity: "", price: "" }] });
        setErrors({});
        onClose();
      })
      .catch(() => {
        // Error already set by hook
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-2xl max-h-screen overflow-y-auto rounded-lg bg-linear-to-b from-[#0f1e3f] to-[#0a1628] p-6 border border-blue-700/30 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Create Purchase Order</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200">Supplier</label>
            <select
              value={formData.supplierId}
              onChange={(e) =>
                setFormData({ ...formData, supplierId: e.target.value })
              }
              className="mt-1 w-full border border-blue-600/40 rounded-md bg-[#0f1e3f] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">-- Select a Supplier --</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.id})
                </option>
              ))}
            </select>
            {errors.supplierId && (
              <p className="text-xs text-rose-400 mt-1">{errors.supplierId}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-200">Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition"
              >
                + Add Item
              </button>
            </div>

            {errors.items && (
              <p className="text-xs text-rose-400 mb-2">{errors.items}</p>
            )}

            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      handleItemChange(index, "productId", e.target.value)
                    }
                    className="flex-1 border border-blue-600/40 rounded-md bg-[#0f1e3f] px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="">-- Select Product --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name || product.title} ({product.sku || product.code || product.id})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="w-20 border border-blue-600/40 rounded-md bg-[#0f1e3f] px-2 py-1 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="Qty"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    className="w-20 border border-blue-600/40 rounded-md bg-[#0f1e3f] px-2 py-1 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    placeholder="Price"
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-rose-400 hover:text-rose-300 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-blue-700/30">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md bg-slate-700/50 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600/50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-linear-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50 transition"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Inline Status Update Modal Component
function StatusUpdateModal({ isOpen, onClose, onSubmit, isSubmitting, purchase }) {
  const [selectedStatus, setSelectedStatus] = useState(purchase?.status || "PENDING");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedStatus)
      .then(() => {
        onClose();
      })
      .catch(() => {
        // Error already set by hook
      });
  };

  if (!isOpen || !purchase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-lg bg-linear-to-b from-[#0f1e3f] to-[#0a1628] p-6 border border-blue-700/30 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Update Purchase Status</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-md bg-blue-700/20 border border-blue-600/40">
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-slate-200">Purchase:</span> {purchase.supplierName || purchase.supplier?.name || "Purchase"}
          </p>
          <p className="text-sm text-slate-300 mt-1">
            <span className="font-semibold text-slate-200">Current Status:</span>{" "}
            {normalizeDisplayStatus(purchase.status)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              New Status
            </label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full appearance-none border border-blue-600/40 rounded-md bg-[#0f1e3f] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {BACKEND_STATUS_VALUES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_DISPLAY_MAP[status]}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-blue-700/30">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md bg-slate-700/50 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600/50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedStatus === purchase.status}
              className="flex-1 rounded-md bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50 transition"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Render the main purchases component.
export default function PurchasesPage() {
  // Read purchases data and actions from a custom hook.
  const {
    purchases,
    suppliers,
    products,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    canCreate,
    create,
    updateStatus,
    getById,
    clearMessages,
  } = usePurchases();

  // Local state for modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [selectedPurchaseForStatus, setSelectedPurchaseForStatus] = useState(null);
  const [detailError, setDetailError] = useState("");

  // Compute derived purchases data from current state.
  const purchaseCards = useMemo(() => {
    return purchases.map((purchase) => {
      return {
        ...purchase,
        displayStatus: normalizeDisplayStatus(purchase.status),
      };
    });
  }, [purchases]);

  // Compute derived purchases data from current state.
  const totalPurchasesThisMonth = useMemo(() => {
    const now = new Date();
    const targetMonth = now.getMonth();
    const targetYear = now.getFullYear();

    return purchaseCards.reduce((sum, purchase) => {
      const purchaseDate = new Date(purchase.createdAt);
      const isSameMonth =
        !Number.isNaN(purchaseDate.getTime()) &&
        purchaseDate.getMonth() === targetMonth &&
        purchaseDate.getFullYear() === targetYear;

      return isSameMonth ? sum + purchase.totalAmount : sum;
    }, 0);
  }, [purchaseCards]);

  // Compute derived purchases data from current state.
  const pendingOrders = useMemo(() => {
    return purchaseCards.filter((purchase) => purchase.status === "PENDING").length;
  }, [purchaseCards]);

  // Compute derived purchases data from current state.
  const receivedOrders = useMemo(() => {
    return purchaseCards.filter((purchase) => purchase.status === "RECEIVED").length;
  }, [purchaseCards]);

  // Compute derived purchases data from current state.
  const totalSpend = useMemo(() => {
    return purchaseCards.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  }, [purchaseCards]);

  // Compute derived purchases data from current state.
  const boardData = useMemo(() => {
    return {
      Pending: purchaseCards.filter((purchase) => purchase.status === "PENDING"),
      Received: purchaseCards.filter((purchase) => purchase.status === "RECEIVED"),
      "In Transit": purchaseCards.filter((purchase) => purchase.status === "IN_TRANSIT"),
      Delivered: purchaseCards.filter((purchase) => purchase.status === "DELIVERED"),
    };
  }, [purchaseCards]);

  // Handlers
  const handleCreateClick = () => {
    clearMessages();
    setDetailError("");
    setIsCreateOpen(true);
  };

  const handleStatusUpdateClick = async (purchase) => {
    clearMessages();
    setDetailError("");
    try {
      const fullPurchase = await getById(purchase.id);
      setSelectedPurchaseForStatus(fullPurchase);
      setIsStatusUpdateOpen(true);
    } catch (err) {
      setDetailError(err.message || "Failed to load purchase details");
    }
  };

  const handleCreateSubmit = async (payload) => {
    try {
      await create(payload);
      setIsCreateOpen(false);
    } catch (err) {
      // Error already set by hook
      throw err;
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await updateStatus(selectedPurchaseForStatus.id, status);
      setIsStatusUpdateOpen(false);
    } catch (err) {
      // Error already set by hook
      throw err;
    }
  };

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl rounded-[44px] border border-blue-900/60 bg-linear-to-br from-[#061330] via-[#0b1b48] to-[#06163f] p-4 shadow-[0_40px_100px_rgba(2,8,35,0.75)] sm:p-6">
        <div className="mb-4 border-b border-blue-800/35 pb-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Purchases</h1>
        </div>

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-emerald-500/20 border border-emerald-500/40 p-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <p className="text-sm text-emerald-300">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-rose-500/20 border border-rose-500/40 p-3">
            <AlertCircle className="h-4 w-4 text-rose-400" />
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}

        {detailError && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-rose-500/20 border border-rose-500/40 p-3">
            <AlertCircle className="h-4 w-4 text-rose-400" />
            <p className="text-sm text-rose-300">{detailError}</p>
          </div>
        )}

        <div className="mb-5 flex justify-center">
          <button
            type="button"
            onClick={handleCreateClick}
            disabled={!canCreate || isSubmitting}
            className="inline-flex min-w-68 items-center justify-center gap-2 rounded-md bg-linear-to-r from-[#2d6dff] to-[#1bd6d1] px-5 py-2.5 text-base font-bold text-white shadow-[0_10px_26px_rgba(38,146,255,0.36)] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="h-5 w-5" strokeWidth={2.2} />
            Create Purchase Order
          </button>
        </div>

        {isLoading ? <p className="mb-4 text-sm text-slate-300">Loading purchases...</p> : null}

        {!isLoading && !error ? (
          <>
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-md border border-blue-700/30 bg-linear-to-r from-[#3f4d8a]/75 to-[#2d3f7a]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-cyan-200" />
                  <p className="text-sm font-semibold text-slate-200">Total Purchases This Month</p>
                </div>
                <p className="mt-1 pl-6 text-3xl font-extrabold leading-none text-white">
                  {formatMoney(totalPurchasesThisMonth)}
                </p>
              </article>

              <article className="rounded-md border border-blue-700/30 bg-linear-to-r from-[#8e5a2f]/75 to-[#3a3b62]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-amber-200" />
                  <p className="text-sm font-semibold text-slate-200">Pending Orders</p>
                </div>
                <p className="mt-1 pl-6 text-3xl font-extrabold leading-none text-white">{pendingOrders}</p>
              </article>

              <article className="rounded-md border border-blue-700/30 bg-linear-to-r from-[#3a7a5f]/75 to-[#2f4a6f]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                  <p className="text-sm font-semibold text-slate-200">Received Orders</p>
                </div>
                <p className="mt-1 pl-6 text-3xl font-extrabold leading-none text-white">{receivedOrders}</p>
              </article>

              <article className="rounded-md border border-blue-700/30 bg-linear-to-r from-[#6f7f32]/75 to-[#2f4a6f]/65 px-3 py-2.5 shadow-[0_10px_22px_rgba(0,0,0,0.26)]">
                <div className="flex items-center gap-2">
                  <BadgeDollarSign className="h-4 w-4 text-lime-200" />
                  <p className="text-sm font-semibold text-slate-200">Total Spend</p>
                </div>
                <p className="mt-1 pl-6 text-3xl font-extrabold leading-none text-white">{formatMoney(totalSpend)}</p>
              </article>
            </div>

            <div className="border-y border-blue-800/35 py-2">
              <div className="overflow-x-auto pb-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {boardColumns.map((column) => (
                    <section key={column} className="w-full">
                      <header className="mb-3 border-b border-blue-800/35 pb-1.5 flex items-center gap-2">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">{column}</h2>
                        <span className="rounded-full bg-[#1a3167]/90 px-2 py-0.5 text-xs font-semibold text-slate-100">
                          {boardData[column].length}
                        </span>
                      </header>

                      <div className="flex flex-col gap-3">
                        {boardData[column].map((purchase) => (
                          <article
                            key={purchase.id}
                            className="rounded-xl border border-blue-700/40 bg-linear-to-b
                             from-[#1c2c4d]/90 to-[#0e1a2f]/90 px-5 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-base font-bold text-cyan-300 break-all">
                                {purchase.supplierName || purchase.supplier?.name || "Purchase"}
                              </span>
                              <span className="text-2xl font-extrabold text-white">{formatMoney(purchase.totalAmount)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">{formatBoardDate(purchase.createdAt)}</span>
                              <button
                                type="button"
                                onClick={() => handleStatusUpdateClick(purchase)}
                                disabled={isSubmitting}
                                className="inline-flex items-center rounded bg-amber-500 px-2 py-1 text-xs text-white hover:bg-amber-400 disabled:opacity-50"
                                aria-label="Update purchase status"
                                title="Update Status"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            </div>
                          </article>
                        ))}

                        {boardData[column].length === 0 ? (
                          <p className="rounded-md border border-dashed border-blue-700/40 bg-[#102250]/45 px-3 py-3 text-center text-xs text-slate-300">
                            No orders in this stage.
                          </p>
                        ) : null}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <CreatePurchaseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={isSubmitting}
        suppliers={suppliers}
        products={products}
      />

      <StatusUpdateModal
        isOpen={isStatusUpdateOpen}
        onClose={() => setIsStatusUpdateOpen(false)}
        onSubmit={handleStatusUpdate}
        isSubmitting={isSubmitting}
        purchase={selectedPurchaseForStatus}
      />
    </section>
  );
}

