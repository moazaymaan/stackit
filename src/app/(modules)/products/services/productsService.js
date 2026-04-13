// Purpose: This module handles products logic and UI.

import productsMock from "../../../../mock/products";

let productsStore = productsMock.map((item) => ({ ...item }));

// Process helper logic for products data and behavior.
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getProducts() {
  await delay(250);
  return productsStore.map((item) => ({ ...item }));
}

export async function getProductById(productId) {
  await delay(150);
  return productsStore.find((item) => item.id === productId) || null;
}

export async function createProduct(payload) {
  await delay(200);

  const newProduct = {
    id: `prod-${Date.now()}`,
    ...payload,
  };

  productsStore = [newProduct, ...productsStore];
  return { ...newProduct };
}

export async function updateProduct(productId, updates) {
  await delay(200);

  productsStore = productsStore.map((item) => {
    if (item.id !== productId) {
      return item;
    }

    return { ...item, ...updates };
  });

  return productsStore.find((item) => item.id === productId) || null;
}

export async function deleteProduct(productId) {
  await delay(200);

  const exists = productsStore.some((item) => item.id === productId);
  productsStore = productsStore.filter((item) => item.id !== productId);

  return { success: exists };
}

