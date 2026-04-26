// Purpose: This module handles inventory logic and UI.

import apiClient from "../../../../lib/apiClient";

function normalizeErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || error?.message || fallbackMessage;
}

function normalizeInventoryLog(log) {
  if (!log || typeof log !== "object") {
    return null;
  }

  const id = log._id || log.id || "";

  return {
    id,
    _id: id,
    productId: log.productId || "",
    type: String(log.type || "").toUpperCase(),
    quantity: Number(log.quantity ?? 0),
    source: String(log.source || "").toUpperCase(),
    referenceId: log.referenceId || log.reference_id || "",
    createdAt: log.createdAt || log.created_at || "",
  };
}

function extractLogs(payload) {
  const data = payload?.data ?? payload;
  const list = data?.data ?? data;
  return Array.isArray(list) ? list : [];
}

export async function getInventoryLogs() {
  try {
    const response = await apiClient.get("/inventory");
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload?.message || "Unable to load inventory logs.");
    }

    return extractLogs(payload).map(normalizeInventoryLog).filter(Boolean);
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to load inventory logs."));
  }
}

export async function getInventoryLogsByProductId(productId) {
  try {
    const response = await apiClient.get(`/inventory/${productId}`);
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload?.message || "Unable to load inventory logs.");
    }

    return extractLogs(payload).map(normalizeInventoryLog).filter(Boolean);
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to load inventory logs."));
  }
}

export async function getCurrentStockByProductId(productId) {
  try {
    const response = await apiClient.get(`/inventory/stock/${productId}`);
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload?.message || "Unable to load product stock.");
    }

    const data = payload?.data ?? payload;
    const stockValue = data?.data?.stock ?? data?.stock ?? 0;

    return {
      productId: data?.data?.productId ?? data?.productId ?? productId,
      stock: Number(stockValue ?? 0),
    };
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to load product stock."));
  }
}

