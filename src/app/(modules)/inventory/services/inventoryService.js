// Purpose: This module handles inventory logic and UI.

import apiClient from "../../../../lib/apiClient";

function normalizeErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || error?.message || fallbackMessage;
}

// Accepts a productsMap (id -> product object) to enrich log with productName
function normalizeInventoryLog(log, productsMap = {}) {
  if (!log || typeof log !== "object") {
    return null;
  }
  const id = log._id || log.id || "";
  const productId = log.productId || "";
  const product = productsMap[productId] || null;
  
  // Resolve product name from backend if provided, fallback to product map
  let productName = "";
  if (log.productName) {
    productName = String(log.productName).trim();
  } else if (log.product_name) {
    productName = String(log.product_name).trim();
  } else if (product) {
    productName = String(product.name || product.title || product.productName || "").trim();
  }
  
  return {
    id,
    _id: id,
    productId,
    productName: productName || "",
    productSku: log.productSku || log.product_sku || product?.sku || "",
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
  // Fetch products for mapping
  const { getProducts } = await import("../../products/services/productsService");
  let products = [];
  try {
    products = await getProducts();
  } catch { products = []; }
  const productsMap = Object.fromEntries(products.map(p => [p.id, p]));

  try {
    const response = await apiClient.get("/inventory");
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload?.message || "Unable to load inventory logs.");
    }

    return extractLogs(payload).map(l => normalizeInventoryLog(l, productsMap)).filter(Boolean);
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

