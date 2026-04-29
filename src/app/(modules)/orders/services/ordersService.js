// Purpose: This module handles orders logic and UI.

import apiClient from "../../../../lib/apiClient";

function normalizeErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;
  const responseMessage = responseData?.message || responseData?.error?.message;
  return responseMessage || error?.message || fallbackMessage;
}

function extractOrderEntity(payload) {
  const data = payload?.data ?? payload ?? {};
  return data?.data ?? data?.order ?? data;
}

function extractOrderList(payload) {
  const data = payload?.data ?? payload ?? {};
  const candidate = data?.data ?? data?.orders ?? data;
  return Array.isArray(candidate) ? candidate : [];
}

function normalizeOrderItem(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  return {
    productId: item.productId || item.product_id || "",
    quantity: Number(item.quantity ?? 0),
    price: Number(item.price ?? 0),
  };
}

function normalizeEntityId(value) {
  if (!value || typeof value !== "object") {
    return String(value || "").trim();
  }

  return String(value.id || value._id || value.uuid || "").trim();
}

function resolveCustomerName(customer) {
  if (!customer || typeof customer !== "object") {
    return "";
  }

  return String(
    customer.name ||
      customer.customerName ||
      customer.email ||
      customer.username ||
      customer.displayName ||
      "",
  ).trim();
}

function resolveProductName(product) {
  if (!product || typeof product !== "object") {
    return "";
  }

  return String(product.name || product.title || product.productName || "").trim();
}

function buildProductsMap(products = []) {
  return products.reduce((accumulator, product) => {
    if (!product || typeof product !== "object") {
      return accumulator;
    }

    const keys = [product.id, product._id, product.uuid].map(normalizeEntityId).filter(Boolean);

    for (const key of keys) {
      accumulator[key] = product;
    }

    return accumulator;
  }, {});
}

function enrichOrderItems(items = [], productsMap = {}) {
  return (items || []).map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }

    const productId = String(item.productId || "").trim();
    const product = productsMap[productId] || null;
    const productName = resolveProductName(product) || "Product";

    return {
      ...item,
      productName,
    };
  });
}

function buildCustomersMap(customers = []) {
  return customers.reduce((accumulator, customer) => {
    if (!customer || typeof customer !== "object") {
      return accumulator;
    }

    const keys = [customer.id, customer._id, customer.uuid].map(normalizeEntityId).filter(Boolean);

    for (const key of keys) {
      accumulator[key] = customer;
    }

    return accumulator;
  }, {});
}

function normalizeOrder(order) {
  if (!order || typeof order !== "object") {
    return null;
  }

  const id = order.id || order._id || "";

  return {
    id,
    _id: id,
    customerName: order.customerName || order.customer_name || "",
    items: Array.isArray(order.items) ? order.items.map(normalizeOrderItem).filter(Boolean) : [],
    status: String(order.status || "").toUpperCase(),
    totalAmount: Number(order.totalAmount ?? order.total_amount ?? 0),
    createdAt: order.createdAt || order.created_at || "",
    updatedAt: order.updatedAt || order.updated_at || "",
  };
}

// Accepts customersMap and productsMap (id -> entity object) to enrich order with customerName and product names.
function normalizeOrderWithCustomers(order, customersMap = {}, productsMap = {}) {
  if (!order || typeof order !== "object") {
    return null;
  }

  const customerReference = order.customer || order.customerId || order.customerInfo || null;
  const customerId = normalizeEntityId(customerReference);
  const customer =
    customersMap[customerId] ||
    customersMap[normalizeEntityId(order.customerId)] ||
    (customerReference && typeof customerReference === "object" ? customerReference : null);
  const customerName =
    resolveCustomerName(customer) ||
    resolveCustomerName(order.customer) ||
    String(order.customerName || order.customer_name || "Customer").trim() ||
    "Customer";
  const id = order.id || order._id || "";

  return {
    id,
    _id: id,
    customerId,
    customerName,
    items: enrichOrderItems(order.items || [], productsMap),
    status: String(order.status || "").toUpperCase(),
    totalAmount: Number(order.totalAmount ?? order.total_amount ?? 0),
    createdAt: order.createdAt || order.created_at || "",
    updatedAt: order.updatedAt || order.updated_at || "",
  };
}

function normalizeMutationResponse(payload, fallbackMessage) {
  const top = payload?.data ?? payload ?? {};
  const entity = extractOrderEntity(payload);

  return {
    success: top?.success ?? true,
    message: top?.message || fallbackMessage,
    data: normalizeOrder(entity),
  };
}

export async function getOrders() {
  try {
    const response = await apiClient.get("/orders");
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload?.message || "Unable to load orders.");
    }

    // Fetch customers and products for mapping
    const { getUsers } = await import("../../users/services/userService");
    const { getProducts } = await import("../../products/services/productsService");
    let customers = [];
    let products = [];
    try {
      customers = await getUsers().catch(() => []);
    } catch {
      customers = [];
    }
    try {
      products = await getProducts().catch(() => []);
    } catch {
      products = [];
    }
    const customersMap = buildCustomersMap(customers);
    const productsMap = buildProductsMap(products);

    return extractOrderList(payload)
      .map((o) => normalizeOrderWithCustomers(o, customersMap, productsMap))
      .filter(Boolean);
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to load orders."));
  }
}

export async function getOrderById(orderId) {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    const payload = response.data;

    if (payload?.success === false) {
      throw new Error(payload?.message || "Unable to load the order.");
    }

    // Fetch customers and products for mapping
    const { getUsers } = await import("../../users/services/userService");
    const { getProducts } = await import("../../products/services/productsService");
    let customers = [];
    let products = [];
    try {
      customers = await getUsers().catch(() => []);
    } catch {
      customers = [];
    }
    try {
      products = await getProducts().catch(() => []);
    } catch {
      products = [];
    }
    const customersMap = buildCustomersMap(customers);
    const productsMap = buildProductsMap(products);

    return normalizeOrderWithCustomers(extractOrderEntity(payload), customersMap, productsMap);
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to load the order."));
  }
}

export async function createOrder(payload) {
  try {
    const response = await apiClient.post("/orders", payload);
    const normalized = normalizeMutationResponse(response.data, "Order created.");

    if (normalized.success === false) {
      throw new Error(normalized.message || "Unable to create order.");
    }

    // Fetch customers and products for mapping to enrich response
    const { getUsers } = await import("../../users/services/userService");
    const { getProducts } = await import("../../products/services/productsService");
    let customers = [];
    let products = [];
    try {
      customers = await getUsers().catch(() => []);
    } catch {
      customers = [];
    }
    try {
      products = await getProducts().catch(() => []);
    } catch {
      products = [];
    }
    const customersMap = buildCustomersMap(customers);
    const productsMap = buildProductsMap(products);
    const enrichedOrder = normalizeOrderWithCustomers(normalized.data, customersMap, productsMap);

    return {
      ...normalized,
      data: enrichedOrder,
    };
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to create order."));
  }
}

export async function confirmOrder(orderId) {
  try {
    const response = await apiClient.put(`/orders/${orderId}/confirm`);
    const normalized = normalizeMutationResponse(response.data, "Order confirmed.");

    if (normalized.success === false) {
      throw new Error(normalized.message || "Unable to confirm order.");
    }

    // Fetch customers and products for mapping to enrich response
    const { getUsers } = await import("../../users/services/userService");
    const { getProducts } = await import("../../products/services/productsService");
    let customers = [];
    let products = [];
    try {
      customers = await getUsers().catch(() => []);
    } catch {
      customers = [];
    }
    try {
      products = await getProducts().catch(() => []);
    } catch {
      products = [];
    }
    const customersMap = buildCustomersMap(customers);
    const productsMap = buildProductsMap(products);
    const enrichedOrder = normalizeOrderWithCustomers(normalized.data, customersMap, productsMap);

    return {
      ...normalized,
      data: enrichedOrder,
    };
  } catch (error) {
    // Preserve stock failure details when present.
    const responseData = error?.response?.data;
    const message = normalizeErrorMessage(error, "Unable to confirm order.");
    const customError = new Error(message);
    customError.status = error?.response?.status;
    customError.details = responseData?.data || responseData?.details || responseData || null;
    throw customError;
  }
}

