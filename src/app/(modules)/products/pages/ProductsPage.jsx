"use client";

// Purpose: This module handles products logic and UI.

import { useState, useEffect, useCallback } from "react";
import { useProducts } from "../hooks/useProducts";

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
function ProductForm({ isOpen, onClose, onSave, product = null, mode = "add" }) {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "",
    price: "",
  });

  const [errors, setErrors] = useState({});

  const getInitialFormData = useCallback(() => {
    if (mode === "edit" && product) {
      return {
        sku: product.sku || "",
        name: product.name || "",
        category: product.category || "",
        price: product.unitPrice?.toString() || "",
      };
    }
    return {
      sku: "",
      name: "",
      category: "",
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
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        ...product,
        sku: formData.sku,
        name: formData.name,
        category: formData.category,
        unitPrice: parseFloat(formData.price),
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

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
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
            <label htmlFor="category" className="mb-1.5 block text-sm font-semibold text-slate-200">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Enter category"
              className="w-full rounded-lg border border-blue-700/50 bg-[#0a1a45]/75 px-3 py-2.5 text-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
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
        </form>

        <div className="flex justify-end gap-3 border-t border-blue-700/40 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-blue-700/45 bg-[#0a1a45]/70 px-4 py-2.5 font-medium text-slate-200 transition hover:bg-[#102555]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-linear-to-r from-[#2d6dff] to-[#1ea0ff] px-4 py-2.5 font-bold text-white shadow-[0_6px_20px_rgba(33,118,255,0.35)] transition hover:brightness-110"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Render the main products component.
export default function ProductsPage() {
  // Read products data and actions from a custom hook.
  const { products, isLoading, error } = useProducts();
  const [localProducts, setLocalProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formMode, setFormMode] = useState("add");

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Handle local products events and state updates.
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormMode("add");
    setIsFormOpen(true);
  };

  // Handle local products events and state updates.
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  // Handle local products events and state updates.
  const handleDeleteProduct = (productId) => {
    setLocalProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Handle local products events and state updates.
  const handleSaveProduct = (formData) => {
    if (formMode === "edit" && selectedProduct) {
      // Update existing product
      setLocalProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? { ...p, ...formData } : p))
      );
    } else {
      // Add new product with unique id
      const newProduct = {
        ...formData,
        id: Math.max(...localProducts.map((p) => p.id || 0), 0) + 1,
      };
      setLocalProducts((prev) => [...prev, newProduct]);
    }
    setIsFormOpen(false);
  };

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-blue-800/40 bg-linear-to-br from-[#0f1f56] via-[#101d48] to-[#061338] p-4 shadow-[0_24px_80px_rgba(3,10,35,0.55)] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Products</h1>
        <button
          onClick={handleAddProduct}
          type="button"
          className="inline-flex items-center rounded-md bg-linear-to-r from-[#2d6dff] to-[#1ea0ff] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(33,118,255,0.35)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-blue-700/40 bg-[#0f1f4f]/70 backdrop-blur">
        <table className="min-w-full text-left text-sm text-slate-100">
          <thead className="bg-[#0a1a45]/70 text-xs font-semibold uppercase tracking-wide text-slate-300">
            <tr>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-300">
                  Loading products...
                </td>
              </tr>
            ) : null}

            {!isLoading && error ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-rose-300">
                  {error}
                </td>
              </tr>
            ) : null}

            {!isLoading && !error
              ? localProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`border-t border-blue-800/45 transition-colors hover:bg-[#1a2f67]/50 ${
                      index % 2 === 0 ? "bg-[#0f1f4f]/55" : "bg-[#12265a]/55"
                    }`}
                  >
                    <td className="px-5 py-4 text-slate-100">{product.sku}</td>
                    <td className="px-5 py-4 font-medium text-white">{product.name}</td>
                    <td className="px-5 py-4 text-slate-200">{product.category}</td>
                    <td className="px-5 py-4 text-slate-100">${product.unitPrice}</td>
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
                          onClick={() => handleDeleteProduct(product.id)}
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500"
                        >
                          <DeleteIcon />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        mode={formMode}
      />
      </div>
    </section>
  );
}

