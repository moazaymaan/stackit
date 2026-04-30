"use client";

// Purpose: This module handles dashboard logic and data fetching.

import { useCallback, useEffect, useState } from "react";
import {
  getMonthlyPurchases,
  getMonthlyOrders,
  getTopProducts,
  getLowStockProducts,
  getFinanceSummary,
  getCurrentUserRoleFromToken,
} from "../services/dashboardService";
import { normalizeUserRole } from "../../../../lib/userRoles";

const READ_ROLES = ["ADMIN", "ACCOUNTANT", "WAREHOUSE"];

// Expose reusable dashboard logic for other modules.
export function useDashboard() {
  const [purchases, setPurchases] = useState([]);
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [finance, setFinance] = useState({ totalSpend: 0, revenue: 0, profit: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  // Compute role-based permissions
  const normalizedRole = normalizeUserRole(currentUserRole);
  const canRead = READ_ROLES.includes(normalizedRole);

  const year = new Date().getFullYear();

  const loadDashboard = useCallback(async () => {
    if (!canRead) {
      setError("You do not have permission to view dashboard.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Fetch all 5 endpoints in parallel
      const [purchasesData, ordersData, productsData, stockData, financeData] = await Promise.all([
        getMonthlyPurchases(year, normalizedRole),
        getMonthlyOrders(year, normalizedRole),
        getTopProducts(normalizedRole),
        getLowStockProducts(normalizedRole),
        getFinanceSummary(normalizedRole),
      ]);

      setPurchases(Array.isArray(purchasesData) ? purchasesData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setTopProducts(Array.isArray(productsData) ? productsData : []);
      setLowStock(Array.isArray(stockData) ? stockData : []);
      setFinance(financeData || { totalSpend: 0, revenue: 0, profit: 0 });
    } catch (err) {
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [canRead, normalizedRole, year]);

  useEffect(() => {
    const roleFromToken = getCurrentUserRoleFromToken();
    setCurrentUserRole(roleFromToken);
  }, []);

  useEffect(() => {
    if (currentUserRole) {
      loadDashboard();
    }
  }, [currentUserRole, loadDashboard]);

  return {
    purchases,
    orders,
    topProducts,
    lowStock,
    finance,
    isLoading,
    error,
    currentUserRole,
    canRead,
    refresh: loadDashboard,
  };
}
