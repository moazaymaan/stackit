"use client";

// Purpose: This module handles inventory logic and UI.

import { useCallback, useEffect, useMemo, useState } from "react";
import { getProducts } from "../../products/services/productsService";
import { getInventoryLogs } from "../services/inventoryService";

// Expose reusable inventory logic for other modules.
export function useInventory() {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const [logsData, productsData] = await Promise.all([getInventoryLogs(), getProducts()]);
      setLogs(logsData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || "Failed to load inventory.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const productById = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      const id = product?.id || product?._id;
      if (id) {
        map.set(String(id), product);
      }
    });
    return map;
  }, [products]);

  const logsWithProduct = useMemo(() => {
    return logs.map((log) => {
      const product = productById.get(String(log.productId)) || null;
      return {
        ...log,
        productName: product?.name || product?.title || "",
        productSku: product?.sku || product?.code || "",
      };
    });
  }, [logs, productById]);

  const balances = useMemo(() => {
    const byProductId = new Map();

    logsWithProduct.forEach((log) => {
      const productId = String(log.productId || "");
      if (!productId) {
        return;
      }

      const prev = byProductId.get(productId) || {
        productId,
        productName: log.productName || "",
        productSku: log.productSku || "",
        inQty: 0,
        outQty: 0,
        onHand: 0,
        lastMovementAt: "",
        lastSource: "",
        lastReferenceId: "",
      };

      const qty = Number(log.quantity ?? 0) || 0;
      const type = String(log.type || "").toUpperCase();
      const nextIn = prev.inQty + (type === "IN" ? qty : 0);
      const nextOut = prev.outQty + (type === "OUT" ? qty : 0);
      const nextOnHand = nextIn - nextOut;

      const prevDate = prev.lastMovementAt ? new Date(prev.lastMovementAt).getTime() : 0;
      const nextDate = log.createdAt ? new Date(log.createdAt).getTime() : 0;
      const useNextMeta = nextDate >= prevDate;

      byProductId.set(productId, {
        ...prev,
        productName: prev.productName || log.productName || "",
        productSku: prev.productSku || log.productSku || "",
        inQty: nextIn,
        outQty: nextOut,
        onHand: nextOnHand,
        lastMovementAt: useNextMeta ? log.createdAt || prev.lastMovementAt : prev.lastMovementAt,
        lastSource: useNextMeta ? log.source || prev.lastSource : prev.lastSource,
        lastReferenceId: useNextMeta ? log.referenceId || prev.lastReferenceId : prev.lastReferenceId,
      });
    });

    return Array.from(byProductId.values());
  }, [logsWithProduct]);

  return {
    logs: logsWithProduct,
    balances,
    isLoading,
    error,
    refresh: loadInventory,
  };
}

