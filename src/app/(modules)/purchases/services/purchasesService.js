// Purpose: This module handles purchases logic and UI.

import ordersMock from "../../../../mock/orders";

let purchasesStore = ordersMock.map((order) => ({
  id: order.id,
  reference: order.orderNumber,
  status: order.status,
  amount: order.totalAmount,
  expectedDate: order.expectedDate,
}));

// Process helper logic for purchases data and behavior.
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getPurchases() {
  await delay(250);
  return purchasesStore.map((item) => ({ ...item }));
}

export async function getPurchaseById(purchaseId) {
  await delay(150);
  return purchasesStore.find((item) => item.id === purchaseId) || null;
}

export async function createPurchase(payload) {
  await delay(200);

  const newPurchase = {
    id: `pur-${Date.now()}`,
    ...payload,
  };

  purchasesStore = [newPurchase, ...purchasesStore];
  return { ...newPurchase };
}

export async function updatePurchase(purchaseId, updates) {
  await delay(200);

  purchasesStore = purchasesStore.map((item) => {
    if (item.id !== purchaseId) {
      return item;
    }

    return { ...item, ...updates };
  });

  return purchasesStore.find((item) => item.id === purchaseId) || null;
}

export async function deletePurchase(purchaseId) {
  await delay(200);

  const exists = purchasesStore.some((item) => item.id === purchaseId);
  purchasesStore = purchasesStore.filter((item) => item.id !== purchaseId);

  return { success: exists };
}

