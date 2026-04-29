"use client";

// Purpose: This module handles orders logic and UI.

import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeUserRole } from "../../../../lib/userRoles";
import { getCurrentUserRoleFromToken } from "../../suppliers/services/suppliersService";
import { confirmOrder, createOrder, getOrderById, getOrders } from "../services/ordersService";
import { getUsers } from "../../users/services/userService";

const CONFIRM_ROLES = ["ADMIN", "ACCOUNTANT"];

// Expose reusable orders logic for other modules.
export function useOrders() {
  const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const normalizedRole = normalizeUserRole(currentUserRole);
  const canConfirm = CONFIRM_ROLES.includes(normalizedRole);

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setErrorDetails(null);
      setSuccessMessage("");
      const [ordersData, customersData] = await Promise.all([
        getOrders(),
        getUsers().catch(() => []),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    setCurrentUserRole(getCurrentUserRoleFromToken());
  }, []);

  const fetchOrderById = useCallback(async (orderId) => {
    try {
      setIsSubmitting(true);
      setError("");
      setErrorDetails(null);
      setSuccessMessage("");
      const entity = await getOrderById(orderId);
      setSelectedOrder(entity);
      return entity;
    } catch (err) {
      setError(err.message || "Failed to load order.");
      setErrorDetails(err?.details || null);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const runCreateOrder = useCallback(
    async (payload) => {
      try {
        setIsSubmitting(true);
        setError("");
        setErrorDetails(null);
        setSuccessMessage("");
        const result = await createOrder(payload);
        await loadOrders();
        setSuccessMessage(result?.message || "Order created successfully.");
        return result;
      } catch (err) {
        setError(err.message || "Failed to create order.");
        setErrorDetails(err?.details || null);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadOrders],
  );

  const runConfirmOrder = useCallback(
    async (orderId) => {
      try {
        setIsSubmitting(true);
        setError("");
        setErrorDetails(null);
        setSuccessMessage("");
        const result = await confirmOrder(orderId);
        await loadOrders();
        setSuccessMessage(result?.message || "Order confirmed successfully.");
        return result;
      } catch (err) {
        setError(err.message || "Failed to confirm order.");
        setErrorDetails(err?.details || null);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadOrders],
  );

  const clearMessages = useCallback(() => {
    setError("");
    setErrorDetails(null);
    setSuccessMessage("");
  }, []);

  const ordersById = useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      if (order?.id) {
        map.set(order.id, order);
      }
    });
    return map;
  }, [orders]);

  return {
    orders,
      customers,
    ordersById,
    selectedOrder,
    setSelectedOrder,
    currentUserRole: normalizedRole,
    canConfirm,
    isLoading,
    isSubmitting,
    error,
    errorDetails,
    successMessage,
    clearMessages,
    refresh: loadOrders,
    getOrderById: fetchOrderById,
    createOrder: runCreateOrder,
    confirmOrder: runConfirmOrder,
  };
}

