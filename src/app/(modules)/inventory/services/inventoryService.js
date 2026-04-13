// Purpose: This module handles inventory logic and UI.

import inventoryMock from "../../../../mock/inventory";

let inventoryStore = inventoryMock.map((item) => ({ ...item }));

// Process helper logic for inventory data and behavior.
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getInventory() {
  await delay(250);
  return inventoryStore.map((item) => ({ ...item }));
}

export async function getInventoryByProductId(productId) {
  await delay(150);
  return inventoryStore.filter((item) => item.productId === productId);
}

export async function createInventoryItem(payload) {
  await delay(200);

  const newItem = {
    id: `inv-${Date.now()}`,
    ...payload,
  };

  inventoryStore = [newItem, ...inventoryStore];
  return { ...newItem };
}

export async function updateInventoryItem(itemId, updates) {
  await delay(200);

  inventoryStore = inventoryStore.map((item) => {
    if (item.id !== itemId) {
      return item;
    }

    return { ...item, ...updates };
  });

  return inventoryStore.find((item) => item.id === itemId) || null;
}

export async function deleteInventoryItem(itemId) {
  await delay(200);

  const exists = inventoryStore.some((item) => item.id === itemId);
  inventoryStore = inventoryStore.filter((item) => item.id !== itemId);

  return { success: exists };
}

