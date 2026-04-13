"use client";

// Purpose: This module handles orders logic and UI.

import { useEffect, useState } from "react";
import { getOrders } from "../services/ordersService";

// Expose reusable orders logic for other modules.
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    isLoading,
    error,
    refresh: loadOrders,
  };
}

