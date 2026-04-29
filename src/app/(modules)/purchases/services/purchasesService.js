// Purpose: This module handles purchases logic and API integration.

import apiClient from "../../../../lib/apiClient";
import { getAuthToken } from "../../../../lib/authCookies";
import { normalizeUserRole } from "../../../../lib/userRoles";

const READ_ROLES = ["ADMIN", "ACCOUNTANT", "WAREHOUSE"];
const CREATE_UPDATE_ROLES = ["ADMIN", "ACCOUNTANT"];

// Helper: Decode JWT payload to extract role
function decodeJwtPayload(token) {
  try {
    if (!token || !token.includes(".")) {
      return null;
    }

    const payloadSegment = token.split(".")[1] || "";
    const normalizedBase64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = normalizedBase64.padEnd(Math.ceil(normalizedBase64.length / 4) * 4, "=");
    const decoded = atob(paddedBase64);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getCurrentUserRoleFromToken() {
  const token = getAuthToken();
  const payload = decodeJwtPayload(token);
  return normalizeUserRole(payload?.role || payload?.user?.role || payload?.data?.role || "");
}

function isRoleAllowed(role, allowedRoles) {
  return allowedRoles.includes(normalizeUserRole(role));
}

function forbiddenError(message = "Forbidden") {
  const error = new Error(message);
  error.status = 403;
  return error;
}

function assertAllowedRole(role, allowedRoles) {
  if (!isRoleAllowed(role, allowedRoles)) {
    throw forbiddenError("Forbidden: you do not have permission to perform this action.");
  }
}

// Helper: Normalize error message from backend response
function normalizeErrorMessage(error, fallbackMessage = "An error occurred") {
  if (typeof error === "string") {
    return error;
  }

  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error?.message ||
    error?.message ||
    fallbackMessage;

  return String(message);
}

// Helper: Normalize purchase entity from backend

function normalizeEntityId(value) {
  if (!value || typeof value !== "object") {
    return String(value || "").trim();
  }

  return String(value.id || value._id || value.uuid || "").trim();
}

function resolveSupplierName(supplier) {
  if (!supplier || typeof supplier !== "object") {
    return "";
  }

  return String(
    supplier.name ||
      supplier.supplierName ||
      supplier.businessName ||
      supplier.companyName ||
      supplier.displayName ||
      "",
  ).trim();
}

function buildSuppliersMap(suppliers = []) {
  return suppliers.reduce((accumulator, supplier) => {
    if (!supplier || typeof supplier !== "object") {
      return accumulator;
    }

    const keys = [supplier.id, supplier._id, supplier.uuid].map(normalizeEntityId).filter(Boolean);

    for (const key of keys) {
      accumulator[key] = supplier;
    }

    return accumulator;
  }, {});
}

// Accepts a suppliersMap (id -> supplier object) to enrich purchase with supplierName.
function normalizePurchase(purchase, suppliersMap = {}) {
  if (!purchase || typeof purchase !== "object") {
    return null;
  }

  const supplierReference = purchase.supplier || purchase.supplierId || purchase.supplierInfo || null;
  const supplierId = normalizeEntityId(supplierReference);
  const supplier =
    suppliersMap[supplierId] ||
    suppliersMap[normalizeEntityId(purchase.supplierId)] ||
    (supplierReference && typeof supplierReference === "object" ? supplierReference : null);
  const supplierName =
    resolveSupplierName(supplier) ||
    resolveSupplierName(purchase.supplier) ||
    String(purchase.supplierName || purchase.vendorName || "Supplier").trim() ||
    "Supplier";

  return {
    id: purchase._id || purchase.id || "",
    supplierId,
    supplierName,
    items: Array.isArray(purchase.items) ? purchase.items : [],
    status: String(purchase.status || "PENDING"),
    totalAmount: Number(purchase.totalAmount ?? 0),
    createdAt: purchase.createdAt || new Date().toISOString(),
    updatedAt: purchase.updatedAt || new Date().toISOString(),
  };
}

// Helper: Extract purchase list from response
function extractPurchaseList(response) {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.purchases)) {
    return data.purchases;
  }

  return [];
}

// Helper: Extract single purchase from response
function extractPurchaseEntity(response) {
  const data = response?.data;

  if (!data) {
    return null;
  }

  if (Array.isArray(data)) {
    return data.length > 0 ? data[0] : null;
  }

  return data;
}


export async function getPurchases(role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, READ_ROLES);

  // Fetch suppliers for mapping
  const { getSuppliers } = await import("../../suppliers/services/suppliersService");
  let suppliers = [];
  try {
    suppliers = await getSuppliers(role);
  } catch {
    suppliers = [];
  }
  const suppliersMap = buildSuppliersMap(suppliers);

  try {
    const response = await apiClient.get("/purchases");
    const purchases = extractPurchaseList(response.data);
    return purchases.map((purchase) => normalizePurchase(purchase, suppliersMap)).filter(Boolean);
  } catch (error) {
    const message = normalizeErrorMessage(error, "Failed to load purchases.");
    throw new Error(message);
  }
}


export async function getPurchaseById(purchaseId, role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, READ_ROLES);

  try {
    const { getSuppliers } = await import("../../suppliers/services/suppliersService");
    let suppliers = [];
    try {
      suppliers = await getSuppliers(role);
    } catch {
      suppliers = [];
    }
    const suppliersMap = buildSuppliersMap(suppliers);
    const response = await apiClient.get(`/purchases/${purchaseId}`);
    const purchase = extractPurchaseEntity(response.data);
    return purchase ? normalizePurchase(purchase, suppliersMap) : null;
  } catch (error) {
    const message = normalizeErrorMessage(error, `Failed to load purchase ${purchaseId}.`);
    throw new Error(message);
  }
}

export async function getPurchasesBySupplier(supplierId, role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, READ_ROLES);

  try {
    const { getSuppliers } = await import("../../suppliers/services/suppliersService");
    let suppliers = [];
    try {
      suppliers = await getSuppliers(role);
    } catch {
      suppliers = [];
    }
    const suppliersMap = buildSuppliersMap(suppliers);
    const response = await apiClient.get(`/purchases/supplier/${supplierId}`);
    const purchases = extractPurchaseList(response.data);
    return purchases.map((purchase) => normalizePurchase(purchase, suppliersMap)).filter(Boolean);
  } catch (error) {
    const message = normalizeErrorMessage(error, `Failed to load purchases for supplier ${supplierId}.`);
    throw new Error(message);
  }
}

export async function createPurchase(payload, role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, CREATE_UPDATE_ROLES);

  try {
    const { getSuppliers } = await import("../../suppliers/services/suppliersService");
    let suppliers = [];
    try {
      suppliers = await getSuppliers(role);
    } catch {
      suppliers = [];
    }
    const suppliersMap = buildSuppliersMap(suppliers);
    const response = await apiClient.post("/purchases", payload);
    const purchase = extractPurchaseEntity(response.data);
    return purchase ? normalizePurchase(purchase, suppliersMap) : null;
  } catch (error) {
    const message = normalizeErrorMessage(error, "Failed to create purchase.");
    throw new Error(message);
  }
}

export async function updatePurchaseStatus(purchaseId, status, role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, CREATE_UPDATE_ROLES);

  try {
    const { getSuppliers } = await import("../../suppliers/services/suppliersService");
    let suppliers = [];
    try {
      suppliers = await getSuppliers(role);
    } catch {
      suppliers = [];
    }
    const suppliersMap = buildSuppliersMap(suppliers);
    const response = await apiClient.put(`/purchases/${purchaseId}/status`, { status });
    const purchase = extractPurchaseEntity(response.data);
    return purchase ? normalizePurchase(purchase, suppliersMap) : null;
  } catch (error) {
    const message = normalizeErrorMessage(error, "Failed to update purchase status.");
    throw new Error(message);
  }
}

