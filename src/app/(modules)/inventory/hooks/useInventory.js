"use client";

// Purpose: This module handles inventory logic and UI.

import { useCallback, useEffect, useState } from "react";
import { getInventory } from "../services/inventoryService";

// Expose reusable inventory logic for other modules.
export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getInventory();
      setInventory(data);
    } catch (err) {
      setError(err.message || "Failed to load inventory.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  return {
    inventory,
    isLoading,
    error,
    refresh: loadInventory,
  };
}

