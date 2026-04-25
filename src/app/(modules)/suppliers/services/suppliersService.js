// Purpose: This module handles suppliers logic and UI.

import suppliersMock from "../../../../mock/suppliers";
import { getAuthToken } from "../../../../lib/authCookies";
import { normalizeUserRole } from "../../../../lib/userRoles";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002").replace(/\/+$/, "");
const SUPPLIERS_API_PATH = `${API_BASE}/api/suppliers`;
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const READ_ROLES = ["ADMIN", "WAREHOUSE", "ACCOUNTANT"];
const CREATE_UPDATE_ROLES = ["ADMIN", "ACCOUNTANT"];
const DELETE_ROLES = ["ADMIN"];

let suppliersStore = suppliersMock.map((item, index) =>
  mapBackendToUi({
    ...item,
    id: item.id || `sup-${index + 1}`,
    address: item.address || item.location || "",
    createdAt: item.createdAt || new Date(Date.now() - index * 60_000).toISOString(),
    status: item.status || "Active",
  }),
);

// Process helper logic for suppliers data and behavior.
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

function sortByCreatedAtDesc(items) {
  return [...items].sort((a, b) => {
    const left = new Date(b.createdAt || 0).getTime();
    const right = new Date(a.createdAt || 0).getTime();
    return left - right;
  });
}

function shouldUseMockFallback(errorOrStatus) {
  if (USE_MOCK) {
    return true;
  }

  if (typeof errorOrStatus === "number") {
    return errorOrStatus === 404;
  }

  const message = String(errorOrStatus?.message || "").toLowerCase();
  return message.includes("failed to fetch") || message.includes("network");
}

async function parseResponse(response) {
  const rawText = await response.text();
  let parsedBody = {};

  if (rawText) {
    try {
      parsedBody = JSON.parse(rawText);
    } catch {
      parsedBody = {};
    }
  }

  if (!response.ok) {
    const errorCollections = [
      parsedBody?.errors,
      parsedBody?.data?.errors,
      parsedBody?.error?.errors,
      parsedBody?.details,
      parsedBody?.data?.details,
      parsedBody?.error?.details,
    ].filter(Boolean);

    const validationMessages = errorCollections
      .flatMap((collection) => {
        if (Array.isArray(collection)) {
          return collection;
        }

        if (typeof collection === "object") {
          return Object.values(collection);
        }

        return [collection];
      })
      .map((entry) => {
        if (typeof entry === "string") {
          return entry;
        }

        if (Array.isArray(entry)) {
          return entry.filter(Boolean).join(", ");
        }

        if (typeof entry === "object" && entry) {
          return entry.message || entry.msg || entry.path || entry.field || JSON.stringify(entry);
        }

        return "";
      })
      .filter(Boolean);

    const message =
      validationMessages.join(" | ") ||
      parsedBody?.message ||
      parsedBody?.data?.message ||
      parsedBody?.error?.message ||
      parsedBody?.error ||
      `Request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    error.details = parsedBody;
    throw error;
  }

  return parsedBody;
}

function buildAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function assertAllowedRole(role, allowedRoles) {
  if (!isRoleAllowed(role, allowedRoles)) {
    throw forbiddenError("Forbidden: you do not have permission to perform this action.");
  }
}

function mapBackendToUi(supplier) {
  if (!supplier || typeof supplier !== "object") {
    return {
      id: "",
      name: "",
      phone: "",
      address: "",
      rating: 0,
      createdAt: new Date().toISOString(),
      status: "Active",
      leadTimeDays: 0,
    };
  }

  return {
    id: supplier.id || supplier._id || supplier.uuid || "",
    name: supplier.name || "",
    phone: supplier.phone || "",
    address: supplier.address || supplier.location || "",
    rating: Number(supplier.rating ?? 0),
    createdAt: supplier.createdAt || supplier.created_at || new Date().toISOString(),
    status: supplier.status || "Active",
    leadTimeDays: Number(supplier.leadTimeDays ?? supplier.lead_time_days ?? 0),
  };
}

function mapUiToBackend(payload) {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const normalizedPhone = String(payload.phone || "").trim();
  const phoneWithCountryCode = normalizedPhone.startsWith("01")
    ? `+20${normalizedPhone.slice(1)}`
    : normalizedPhone;

  const normalized = {
    name: payload.name,
    phone: phoneWithCountryCode,
    address: payload.address,
    location: payload.address,
    status: payload.status || "Active",
  };

  const ratingValue = payload.rating;
  if (ratingValue !== undefined && ratingValue !== null && ratingValue !== "") {
    normalized.rating = Number(ratingValue);
  }

  const leadTimeValue = payload.lead_time_days ?? payload.leadTimeDays;
  if (leadTimeValue !== undefined && leadTimeValue !== null && leadTimeValue !== "") {
    normalized.lead_time_days = Number(leadTimeValue);
  }

  if (payload.status !== undefined && payload.status !== null && payload.status !== "") {
    normalized.status = payload.status;
  }

  return Object.fromEntries(
    Object.entries(normalized).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

function extractSuppliersCollection(body) {
  const candidate = body?.data?.suppliers || body?.data || body?.suppliers || body;

  if (Array.isArray(candidate)) {
    return candidate;
  }

  if (Array.isArray(candidate?.suppliers)) {
    return candidate.suppliers;
  }

  return [];
}

function extractSupplierEntity(body) {
  const candidate = body?.data?.supplier || body?.data || body?.supplier || body;

  if (!candidate) {
    return null;
  }

  if (Array.isArray(candidate)) {
    return candidate.length ? candidate[0] : null;
  }

  return candidate;
}

function getMockSuppliers() {
  return sortByCreatedAtDesc(suppliersStore.map((item) => ({ ...item })));
}

function getMockSupplierById(supplierId) {
  return suppliersStore.find((item) => item.id === supplierId) || null;
}

function createMockSupplier(payload) {
  const newSupplier = mapBackendToUi({
    id: `sup-${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString(),
  });

  suppliersStore = [newSupplier, ...suppliersStore];
  return { ...newSupplier };
}

function updateMockSupplier(supplierId, updates) {
  suppliersStore = suppliersStore.map((item) => {
    if (item.id !== supplierId) {
      return item;
    }

    return mapBackendToUi({
      ...item,
      ...updates,
      id: item.id,
      createdAt: item.createdAt,
    });
  });

  return suppliersStore.find((item) => item.id === supplierId) || null;
}

function deleteMockSupplier(supplierId) {
  const exists = suppliersStore.some((item) => item.id === supplierId);
  suppliersStore = suppliersStore.filter((item) => item.id !== supplierId);

  return { success: exists };
}

export async function getSuppliers(role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, READ_ROLES);

  if (USE_MOCK) {
    return getMockSuppliers();
  }

  try {
    const response = await fetch(SUPPLIERS_API_PATH, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...buildAuthHeaders(),
      },
    });

    const body = await parseResponse(response);
    const suppliers = extractSuppliersCollection(body);
    return sortByCreatedAtDesc(suppliers.map(mapBackendToUi));
  } catch (error) {
    if (!shouldUseMockFallback(error?.status) && !shouldUseMockFallback(error)) {
      throw error;
    }

    return getMockSuppliers();
  }
}

export async function getSupplierById(supplierId, role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, READ_ROLES);

  if (USE_MOCK) {
    return getMockSupplierById(supplierId);
  }

  try {
    const response = await fetch(`${SUPPLIERS_API_PATH}/${supplierId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...buildAuthHeaders(),
      },
    });

    const body = await parseResponse(response);
    const supplier = extractSupplierEntity(body);
    return supplier ? mapBackendToUi(supplier) : null;
  } catch (error) {
    if (!shouldUseMockFallback(error?.status) && !shouldUseMockFallback(error)) {
      throw error;
    }

    return getMockSupplierById(supplierId);
  }
}

export async function createSupplier(payload, role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, CREATE_UPDATE_ROLES);

  if (USE_MOCK) {
    return createMockSupplier(payload);
  }

  try {
    const backendPayload = mapUiToBackend(payload);

    const response = await fetch(SUPPLIERS_API_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildAuthHeaders(),
      },
      body: JSON.stringify(backendPayload),
    });

    const body = await parseResponse(response);
    const createdSupplier = extractSupplierEntity(body);
    return mapBackendToUi(createdSupplier);
  } catch (error) {
    if (!shouldUseMockFallback(error?.status) && !shouldUseMockFallback(error)) {
      throw error;
    }

    return createMockSupplier(payload);
  }
}

export async function updateSupplier(supplierId, updates, role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, CREATE_UPDATE_ROLES);

  if (USE_MOCK) {
    return updateMockSupplier(supplierId, updates);
  }

  try {
    const backendPayload = mapUiToBackend(updates);

    const response = await fetch(`${SUPPLIERS_API_PATH}/${supplierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...buildAuthHeaders(),
      },
      body: JSON.stringify(backendPayload),
    });

    const body = await parseResponse(response);
    const updatedSupplier = extractSupplierEntity(body);
    return mapBackendToUi(updatedSupplier);
  } catch (error) {
    if (!shouldUseMockFallback(error?.status) && !shouldUseMockFallback(error)) {
      throw error;
    }

    return updateMockSupplier(supplierId, updates);
  }
}

export async function deleteSupplier(supplierId, role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, DELETE_ROLES);

  if (USE_MOCK) {
    return deleteMockSupplier(supplierId);
  }

  try {
    const response = await fetch(`${SUPPLIERS_API_PATH}/${supplierId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...buildAuthHeaders(),
      },
    });

    await parseResponse(response);
    return { success: true };
  } catch (error) {
    if (!shouldUseMockFallback(error?.status) && !shouldUseMockFallback(error)) {
      throw error;
    }

    return deleteMockSupplier(supplierId);
  }
}

