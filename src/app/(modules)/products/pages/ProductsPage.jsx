"use client";

// Purpose: This module handles products logic and UI.

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "../hooks/useProducts";
import { getCurrentUser } from "../../auth/services/authService";
import { getAuthToken } from "../../../../lib/authCookies";
import { normalizeUserRole } from "../../../../lib/userRoles";

// Process helper logic for products data and behavior.
function EditIcon() {
  // Render the JSX layout for this section.
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path
        d="M4 20h4l10-10a2 2 0 1 0-4-4L4 16v4Zm9-13 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Process helper logic for products data and behavior.
function DeleteIcon() {
  // Render the JSX layout for this section.
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path
        d="M5 7h14M9 7V5h6v2m-8 0 1 12h8l1-12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Process helper logic for products data and behavior.
function ProductForm({
  isOpen,
  onClose,
  onSave,
  product = null,
  mode = "add",
  isSubmitting = false,
  submitError = "",
}) {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    price: "",
  });

  const [errors, setErrors] = useState({});

  const getInitialFormData = useCallback(() => {
    if (mode === "edit" && product) {
      return {
        sku: product.sku || "",
        name: product.name || "",
        price: String(product.price ?? product.unitPrice ?? ""),
      };
    }
    return {
      sku: "",
      name: "",
      price: "",
    };
  }, [mode, product]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(getInitialFormData());
      setErrors({});
    }
  }, [isOpen, getInitialFormData]);

  // Handle local products events and state updates.
  const validateForm = () => {
    const newErrors = {};

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle local products events and state updates.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle local products events and state updates.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      await onSave({
        ...product,
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        price: parseFloat(formData.price),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-blue-800/45 bg-linear-to-br from-[#0f1f56] via-[#101d48] to-[#061338] shadow-2xl">
        <div className="border-b border-blue-700/40 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {mode === "add" ? "Add Product" : "Edit Product"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <div>
            <label htmlFor="sku" className="mb-1.5 block text-sm font-semibold text-slate-200">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="Enter SKU"
              className={`w-full rounded-lg border px-3 py-2.5 text-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errors.sku
                  ? "border-red-500 bg-[#1a1c40] focus:ring-red-500"
                  : "border-blue-700/50 bg-[#0a1a45]/75 focus:ring-cyan-500"
              }`}
            />
            {errors.sku && (
              <p className="mt-1 text-xs font-medium text-red-400">{errors.sku}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-200">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className={`w-full rounded-lg border px-3 py-2.5 text-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 bg-[#1a1c40] focus:ring-red-500"
                  : "border-blue-700/50 bg-[#0a1a45]/75 focus:ring-cyan-500"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs font-medium text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="mb-1.5 block text-sm font-semibold text-slate-200">
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              className={`w-full rounded-lg border px-3 py-2.5 text-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errors.price
                  ? "border-red-500 bg-[#1a1c40] focus:ring-red-500"
                  : "border-blue-700/50 bg-[#0a1a45]/75 focus:ring-cyan-500"
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-xs font-medium text-red-400">{errors.price}</p>
            )}
          </div>
          {submitError ? <p className="text-sm text-rose-300">{submitError}</p> : null}

          <div className="flex justify-end gap-3 border-t border-blue-700/40 px-0 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-blue-700/45 bg-[#0a1a45]/70 px-4 py-2.5 font-medium text-slate-200 transition hover:bg-[#102555]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-linear-to-r from-[#2d6dff] to-[#1ea0ff] px-4 py-2.5 font-bold text-white shadow-[0_6px_20px_rgba(33,118,255,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteProductModal({ isOpen, product, onCancel, onConfirm, isSubmitting, errorMessage }) {
  if (!isOpen || !product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-rose-700/45 bg-linear-to-br from-[#2a1020] via-[#1d1020] to-[#0f1328] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <h2 className="text-xl font-bold text-white">Delete Product</h2>
        <p className="mt-1 text-sm text-slate-300">
          Are you sure you want to delete <span className="font-semibold text-rose-200">{product.name}</span>?
        </p>

        {errorMessage ? <p className="mt-3 text-sm text-rose-300">{errorMessage}</p> : null}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-blue-700/45 bg-[#0a1a45]/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-[#102555]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-lg bg-linear-to-r from-rose-500 to-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Render the main products component.
export default function ProductsPage() {
  const router = useRouter();

  // Read products data and actions from a custom hook.
  const {
    products,
    isLoading,
    error,
    isSubmitting,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [deleteTargetProduct, setDeleteTargetProduct] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      const token = getAuthToken();

      if (!token) {
        router.replace("/auth/pages/login");
        return;
      }

      try {
        const response = await getCurrentUser();
        const role = response?.user?.role || response?.data?.user?.role || response?.data?.role || "";

        if (isMounted) {
          setCurrentUserRole(role);
          setIsAccessChecked(true);
        }
      } catch {
        router.replace("/auth/pages/login");
      }
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const canWriteProducts = ["ADMIN", "WAREHOUSE"].includes(normalizeUserRole(currentUserRole));

  // Handle local products events and state updates.
  const handleAddProduct = () => {
    if (!canWriteProducts) {
      return;
    }

    setActionError("");
    setSelectedProduct(null);
    setFormMode("add");
    setIsFormOpen(true);
  };

  // Handle local products events and state updates.
  const handleEditProduct = (product) => {
    if (!canWriteProducts) {
      return;
    }

    setActionError("");
    setSelectedProduct(product);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  // Handle local products events and state updates.
  const handleDeleteProduct = (product) => {
    if (!canWriteProducts) {
      return;
    }

    setActionError("");
    setDeleteTargetProduct(product);
  };

  // Handle local products events and state updates.
  const handleSaveProduct = async (formData) => {
    const payload = {
      sku: formData.sku.trim(),
      name: formData.name.trim(),
      price: Number(formData.price),
    };

    try {
      setActionError("");

      if (formMode === "edit" && selectedProduct) {
        const productId = selectedProduct._id || selectedProduct.id;
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }

      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      setActionError(err.message || "Unable to save product.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetProduct) {
      return;
    }

    try {
      setActionError("");
      const productId = deleteTargetProduct._id || deleteTargetProduct.id;
      await deleteProduct(productId);
      setDeleteTargetProduct(null);
    } catch (err) {
      setActionError(err.message || "Unable to delete product.");
    }
  };

  if (!isAccessChecked) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-blue-800/45 bg-[#091b46]/60 px-5 py-4 text-sm text-slate-300">
          Checking access...
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-blue-800/40 bg-linear-to-br from-[#0f1f56] via-[#101d48] to-[#061338] p-4 shadow-[0_24px_80px_rgba(3,10,35,0.55)] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Products</h1>

          {canWriteProducts ? (
            <button
              onClick={handleAddProduct}
              type="button"
              className="inline-flex items-center rounded-md bg-linear-to-r from-[#2d6dff] to-[#1ea0ff] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(33,118,255,0.35)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
            >
              + Add Product
            </button>
          ) : null}
        </div>

        {!canWriteProducts ? (
          <div className="mb-4 rounded-xl border border-amber-600/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Read-only mode: only Admin and Warehouse can create, edit, or delete products.
          </div>
        ) : null}

        {actionError ? (
          <div className="mb-4 rounded-xl border border-rose-700/45 bg-rose-950/35 px-4 py-3 text-sm text-rose-300">
            {actionError}
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-xl border border-blue-700/40 bg-[#0f1f4f]/70 backdrop-blur">
          <table className="min-w-full text-left text-sm text-slate-100">
            <thead className="bg-[#0a1a45]/70 text-xs font-semibold uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Price</th>
                {canWriteProducts ? <th className="px-5 py-3">Actions</th> : null}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={canWriteProducts ? 4 : 3} className="px-5 py-10 text-center text-slate-300">
                    Loading products...
                  </td>
                </tr>
              ) : null}

              {!isLoading && error ? (
                <tr>
                  <td colSpan={canWriteProducts ? 4 : 3} className="px-5 py-10 text-center text-rose-300">
                    {error}
                  </td>
                </tr>
              ) : null}

              {!isLoading && !error && products.length === 0 ? (
                <tr>
                  <td colSpan={canWriteProducts ? 4 : 3} className="px-5 py-10 text-center text-slate-300">
                    No products found.
                  </td>
                </tr>
              ) : null}

              {!isLoading && !error
                ? products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`border-t border-blue-800/45 transition-colors hover:bg-[#1a2f67]/50 ${
                        index % 2 === 0 ? "bg-[#0f1f4f]/55" : "bg-[#12265a]/55"
                      }`}
                    >
                      <td className="px-5 py-4 text-slate-100">{product.sku}</td>
                      <td className="px-5 py-4 font-medium text-white">{product.name}</td>
                      <td className="px-5 py-4 text-slate-100">${Number(product.price ?? product.unitPrice ?? 0).toLocaleString()}</td>
                      {canWriteProducts ? (
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md bg-cyan-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-500"
                            >
                              <EditIcon />
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(product)}
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500"
                            >
                              <DeleteIcon />
                              Delete
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        <ProductForm
          isOpen={isFormOpen}
          onClose={() => {
            setActionError("");
            setIsFormOpen(false);
          }}
          onSave={handleSaveProduct}
          product={selectedProduct}
          mode={formMode}
          isSubmitting={isSubmitting}
          submitError={actionError}
        />

        <DeleteProductModal
          isOpen={Boolean(deleteTargetProduct)}
          product={deleteTargetProduct}
          onCancel={() => {
            setActionError("");
            setDeleteTargetProduct(null);
          }}
          onConfirm={handleConfirmDelete}
          isSubmitting={isSubmitting}
          errorMessage={actionError}
        />
      </div>
    </section>
  );
}

