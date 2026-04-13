// Purpose: This module handles orders logic and UI.

import ordersMock from "../../../../mock/orders";

let ordersStore = ordersMock.map((item) => ({
  ...item,
  items: item.items.map((orderItem) => ({ ...orderItem })),
}));

// Process helper logic for orders data and behavior.
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getOrders() {
  await delay(250);
  return ordersStore.map((item) => ({
    ...item,
    items: item.items.map((orderItem) => ({ ...orderItem })),
  }));
}

export async function getOrderById(orderId) {
  await delay(150);
  return ordersStore.find((item) => item.id === orderId) || null;
}

export async function createOrder(payload) {
  await delay(200);

  const newOrder = {
    id: `ord-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    items: [],
    ...payload,
  };

  ordersStore = [newOrder, ...ordersStore];
  return {
    ...newOrder,
    items: newOrder.items.map((item) => ({ ...item })),
  };
}

export async function updateOrder(orderId, updates) {
  await delay(200);

  ordersStore = ordersStore.map((item) => {
    if (item.id !== orderId) {
      return item;
    }

    return {
      ...item,
      ...updates,
      items: updates.items ? updates.items.map((orderItem) => ({ ...orderItem })) : item.items,
    };
  });

  return ordersStore.find((item) => item.id === orderId) || null;
}

export async function deleteOrder(orderId) {
  await delay(200);

  const exists = ordersStore.some((item) => item.id === orderId);
  ordersStore = ordersStore.filter((item) => item.id !== orderId);

  return { success: exists };
}

