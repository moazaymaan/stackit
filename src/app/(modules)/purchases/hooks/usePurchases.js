"use client";

// Purpose: This module handles purchases logic and UI.

import { useCallback, useEffect, useState } from "react";
import {
  getPurchases,
  getPurchaseById,
  getPurchasesBySupplier,
  createPurchase,
  updatePurchaseStatus,
  getCurrentUserRoleFromToken,
} from "../services/purchasesService";
import { normalizeUserRole } from "../../../../lib/userRoles";

const READ_ROLES = ["ADMIN", "ACCOUNTANT", "WAREHOUSE"];
const CREATE_UPDATE_ROLES = ["ADMIN", "ACCOUNTANT"];

// Expose reusable purchases logic for other modules.
export function usePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  // Compute role-based permissions
  const normalizedRole = normalizeUserRole(currentUserRole);
  const canRead = READ_ROLES.includes(normalizedRole);
  const canCreate = CREATE_UPDATE_ROLES.includes(normalizedRole);

  const loadPurchases = useCallback(async () => {
    if (!canRead) {
      setError("You do not have permission to view purchases.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const data = await getPurchases(normalizedRole);
      setPurchases(data);
    } catch (err) {
      setError(err.message || "Failed to load purchases.");
    } finally {
      setIsLoading(false);
    }
  }, [canRead, normalizedRole]);

  const createPurchaseHandler = useCallback(
    async (payload) => {
      if (!canCreate) {
        throw new Error("You do not have permission to create purchases.");
      }

      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      try {
        const newPurchase = await createPurchase(payload, normalizedRole);
        setPurchases((prev) => [newPurchase, ...prev]);
        setSuccessMessage("Purchase created successfully.");
        return newPurchase;
      } catch (err) {
        const errorMsg = err.message || "Failed to create purchase.";
        setError(errorMsg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [canCreate, normalizedRole],
  );

  const updateStatusHandler = useCallback(
    async (purchaseId, status) => {
      if (!canCreate) {
        throw new Error("You do not have permission to update purchases.");
      }

      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      try {
        const updatedPurchase = await updatePurchaseStatus(purchaseId, status, normalizedRole);
        setPurchases((prev) =>
          prev.map((p) => (p.id === purchaseId ? updatedPurchase : p)),
        );
        setSuccessMessage("Purchase status updated successfully.");
        return updatedPurchase;
      } catch (err) {
        const errorMsg = err.message || "Failed to update purchase status.";
        setError(errorMsg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [canCreate, normalizedRole],
  );

  const getByIdHandler = useCallback(
    async (purchaseId) => {
      if (!canRead) {
        throw new Error("You do not have permission to view purchases.");
      }

      try {
        const purchase = await getPurchaseById(purchaseId, normalizedRole);
        return purchase;
      } catch (err) {
        throw err;
      }
    },
    [canRead, normalizedRole],
  );

  const getBySupplierHandler = useCallback(
    async (supplierId) => {
      if (!canRead) {
        throw new Error("You do not have permission to view purchases.");
      }

      try {
        const supplierPurchases = await getPurchasesBySupplier(supplierId, normalizedRole);
        return supplierPurchases;
      } catch (err) {
        throw err;
      }
    },
    [canRead, normalizedRole],
  );

  const clearMessages = useCallback(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  useEffect(() => {
    const roleFromToken = getCurrentUserRoleFromToken();
    setCurrentUserRole(roleFromToken);
  }, []);

  useEffect(() => {
    if (currentUserRole) {
      loadPurchases();
    }
  }, [currentUserRole, loadPurchases]);

  return {
    purchases,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    currentUserRole,
    canRead,
    canCreate,
    clearMessages,
    refresh: loadPurchases,
    create: createPurchaseHandler,
    updateStatus: updateStatusHandler,
    getById: getByIdHandler,
    getBySupplier: getBySupplierHandler,
  };
}

