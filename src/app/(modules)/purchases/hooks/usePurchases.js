"use client";

// Purpose: This module handles purchases logic and UI.

import { useEffect, useState } from "react";
import { getPurchases } from "../services/purchasesService";

// Expose reusable purchases logic for other modules.
export function usePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPurchases = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getPurchases();
      setPurchases(data);
    } catch (err) {
      setError(err.message || "Failed to load purchases.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  return {
    purchases,
    isLoading,
    error,
    refresh: loadPurchases,
  };
}

