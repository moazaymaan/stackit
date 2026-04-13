"use client";

// Purpose: This module handles suppliers logic and UI.

import { useEffect, useState } from "react";
import { getSuppliers } from "../services/suppliersService";

// Expose reusable suppliers logic for other modules.
export function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err.message || "Failed to load suppliers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  return {
    suppliers,
    isLoading,
    error,
    refresh: loadSuppliers,
  };
}

