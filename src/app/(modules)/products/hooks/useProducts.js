"use client";

// Purpose: This module handles products logic and UI.

import { useEffect, useState } from "react";
import { getProducts } from "../services/productsService";

// Expose reusable products logic for other modules.
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refresh: loadProducts,
  };
}

