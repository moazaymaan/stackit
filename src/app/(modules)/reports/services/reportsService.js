// Purpose: This module handles reports logic and UI.

import inventoryMock from "../../../../mock/inventory";
import ordersMock from "../../../../mock/orders";
import productsMock from "../../../../mock/products";

let reportsProductsStore = productsMock.map((item) => ({ ...item }));
let reportsInventoryStore = inventoryMock.map((item) => ({ ...item }));
let reportsOrdersStore = ordersMock.map((item) => ({ ...item }));

// Process helper logic for reports data and behavior.
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getReportSummary() {
  await delay(250);

  const totalInventoryUnits = reportsInventoryStore.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  return {
    totalProducts: reportsProductsStore.length,
    totalInventoryUnits,
    openOrders: reportsOrdersStore.filter((order) => order.status !== "Delivered").length,
    deliveredOrders: reportsOrdersStore.filter((order) => order.status === "Delivered").length,
  };
}

export async function replaceReportSources({ products, inventory, orders }) {
  await delay(100);

  if (products) {
    reportsProductsStore = products.map((item) => ({ ...item }));
  }

  if (inventory) {
    reportsInventoryStore = inventory.map((item) => ({ ...item }));
  }

  if (orders) {
    reportsOrdersStore = orders.map((item) => ({ ...item }));
  }

  return getReportSummary();
}

