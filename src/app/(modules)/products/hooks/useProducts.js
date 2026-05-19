"use client";

// Purpose: This module handles products logic and UI.

import { useCallback, useEffect, useState } from "react";
import {
  createProduct as createProductRequest,
  deleteProduct as deleteProductRequest,
  getProducts,
  updateProduct as updateProductRequest,
} from "../services/productsService";

function getErrorMessage(error, fallbackMessage) {
  return error?.message || fallbackMessage;
}

// Expose reusable products logic for other modules.
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load products."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runMutation = useCallback(
    async (mutation, fallbackMessage) => {
      try {
        setIsSubmitting(true);
        const result = await mutation();
        await loadProducts();
        return result;
      } catch (err) {
        throw new Error(getErrorMessage(err, fallbackMessage));
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadProducts],
  );

  const createProduct = useCallback(
    async (payload) => runMutation(() => createProductRequest(payload), "Failed to create product."),
    [runMutation],
  );

  const updateProduct = useCallback(
    async (id, payload) => runMutation(() => updateProductRequest(id, payload), "Failed to update product."),
    [runMutation],
  );

  const deleteProduct = useCallback(
    async (id) => runMutation(() => deleteProductRequest(id), "Failed to delete product."),
    [runMutation],
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    isLoading,
    isSubmitting,
    error,
    refresh: loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

