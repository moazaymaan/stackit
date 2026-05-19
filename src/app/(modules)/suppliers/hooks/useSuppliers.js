"use client";

// Purpose: This module handles suppliers logic and UI.

import { useEffect, useState } from "react";
import {
  createSupplier as createSupplierService,
  deleteSupplier as deleteSupplierService,
  getCurrentUserRoleFromToken,
  getSupplierById as getSupplierByIdService,
  getSuppliers,
  updateSupplier as updateSupplierService,
} from "../services/suppliersService";
import { normalizeUserRole } from "../../../../lib/userRoles";

const READ_ROLES = ["ADMIN", "WAREHOUSE", "ACCOUNTANT"];
const CREATE_UPDATE_ROLES = ["ADMIN", "ACCOUNTANT"];
const DELETE_ROLES = ["ADMIN"];

// Expose reusable suppliers logic for other modules.
export function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const normalizedRole = normalizeUserRole(currentUserRole);
  const canRead = READ_ROLES.includes(normalizedRole);
  const canCreate = CREATE_UPDATE_ROLES.includes(normalizedRole);
  const canUpdate = CREATE_UPDATE_ROLES.includes(normalizedRole);
  const canDelete = DELETE_ROLES.includes(normalizedRole);

  const loadSuppliers = async (role = normalizedRole) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      const data = await getSuppliers(role);
      setSuppliers(data);
    } catch (err) {
      setError(err.message || "Failed to load suppliers.");
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createSupplier = async (payload) => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const created = await createSupplierService(payload, normalizedRole);
      setSuppliers((prev) => [created, ...prev]);
      setSuccessMessage("Supplier created successfully.");
      return created;
    } catch (err) {
      setError(err.message || "Failed to create supplier.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSupplier = async (supplierId, updates) => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const updated = await updateSupplierService(supplierId, updates, normalizedRole);
      setSuppliers((prev) =>
        prev.map((supplier) => {
          if (supplier.id !== supplierId) {
            return supplier;
          }

          return { ...supplier, ...updated };
        }),
      );
      setSuccessMessage("Supplier updated successfully.");
      return updated;
    } catch (err) {
      setError(err.message || "Failed to update supplier.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSupplier = async (supplierId) => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result = await deleteSupplierService(supplierId, normalizedRole);

      if (result?.success) {
        setSuppliers((prev) => prev.filter((supplier) => supplier.id !== supplierId));
        setSuccessMessage("Supplier deleted successfully.");
      }

      return result;
    } catch (err) {
      setError(err.message || "Failed to delete supplier.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSupplierById = async (supplierId) => {
    try {
      setError("");
      return await getSupplierByIdService(supplierId, normalizedRole);
    } catch (err) {
      setError(err.message || "Failed to load supplier details.");
      throw err;
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  useEffect(() => {
    const roleFromToken = getCurrentUserRoleFromToken();
    const normalizedFromToken = normalizeUserRole(roleFromToken);
    setCurrentUserRole(normalizedFromToken);
    loadSuppliers(normalizedFromToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    suppliers,
    currentUserRole: normalizedRole,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    clearMessages,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    refresh: loadSuppliers,
  };
}

