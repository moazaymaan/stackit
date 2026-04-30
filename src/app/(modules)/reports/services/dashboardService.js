// Purpose: This module handles dashboard logic and API integration.

import apiClient from "../../../../lib/apiClient";
import { getAuthToken } from "../../../../lib/authCookies";
import { normalizeUserRole } from "../../../../lib/userRoles";

const READ_ROLES = ["ADMIN", "ACCOUNTANT", "WAREHOUSE"];

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

// Helper: Extract data from response
function extractData(response) {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    return data;
  }

  return [];
}

/**
 * Fetch monthly purchases data
 * @param {string} year - YYYY format
 * @returns {Promise<Array>} [{month, total}, ...]
 */
export async function getMonthlyPurchases(year = new Date().getFullYear(), role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, READ_ROLES);

  try {
    const response = await apiClient.get("/dashboard/purchases/monthly", {
      params: { year },
    });
    return extractData(response.data) || [];
  } catch (error) {
    const message = normalizeErrorMessage(error, "Failed to load monthly purchases.");
    throw new Error(message);
  }
}

/**
 * Fetch monthly orders data
 * @param {string} year - YYYY format
 * @returns {Promise<Array>} [{month, total}, ...]
 */
export async function getMonthlyOrders(year = new Date().getFullYear(), role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, READ_ROLES);

  try {
    const response = await apiClient.get("/dashboard/orders/monthly", {
      params: { year },
    });
    return extractData(response.data) || [];
  } catch (error) {
    const message = normalizeErrorMessage(error, "Failed to load monthly orders.");
    throw new Error(message);
  }
}

/**
 * Fetch top products data
 * @returns {Promise<Array>} [{productName, totalSold}, ...]
 */
export async function getTopProducts(role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, READ_ROLES);

  try {
    const response = await apiClient.get("/dashboard/top-products");
    return extractData(response.data) || [];
  } catch (error) {
    const message = normalizeErrorMessage(error, "Failed to load top products.");
    throw new Error(message);
  }
}

/**
 * Fetch low stock products
 * @returns {Promise<Array>} [{productName, stock}, ...]
 */
export async function getLowStockProducts(role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, READ_ROLES);

  try {
    const response = await apiClient.get("/dashboard/low-stock");
    return extractData(response.data) || [];
  } catch (error) {
    const message = normalizeErrorMessage(error, "Failed to load low stock products.");
    throw new Error(message);
  }
}

/**
 * Fetch finance summary
 * @returns {Promise<Object>} {totalSpend, revenue, profit}
 */
export async function getFinanceSummary(role = getCurrentUserRoleFromToken()) {
  assertAllowedRole(role, READ_ROLES);

  try {
    const response = await apiClient.get("/dashboard/finance/summary");
    const data = response?.data?.data || response?.data;
    return {
      totalSpend: Number(data?.totalSpend ?? 0),
      revenue: Number(data?.revenue ?? 0),
      profit: Number(data?.profit ?? 0),
    };
  } catch (error) {
    const message = normalizeErrorMessage(error, "Failed to load finance summary.");
    throw new Error(message);
  }
}
