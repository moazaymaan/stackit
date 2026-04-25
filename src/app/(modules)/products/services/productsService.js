// Purpose: This module handles products logic and UI.

import apiClient from "../../../../lib/apiClient";

function normalizeErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || error?.message || fallbackMessage;
}

function normalizeProduct(product) {
  if (!product) {
    return null;
  }

  const productWithoutCategory = { ...product };
  delete productWithoutCategory.category;
  const normalizedId = product._id || product.id;
  const normalizedPrice = Number(product.price ?? product.unitPrice ?? 0);

  return {
    ...productWithoutCategory,
    id: normalizedId,
    _id: normalizedId,
    price: Number.isFinite(normalizedPrice) ? normalizedPrice : 0,
    unitPrice: Number.isFinite(normalizedPrice) ? normalizedPrice : 0,
  };
}

function extractProductList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (Array.isArray(payload?.data?.products)) {
    return payload.data.products;
  }

  return [];
}

function normalizeMutationResponse(payload, fallbackMessage) {
  const data = payload?.data || payload || {};
  const productData = data?.data || data?.product || data;

  return {
    success: data.success ?? true,
    message: data.message || fallbackMessage,
    data: normalizeProduct(productData),
  };
}

export async function getProducts() {
  try {
    const response = await apiClient.get("/products");
    const payload = response.data;
    const isSuccessful = payload?.success ?? (response.status >= 200 && response.status < 300);

    if (isSuccessful === false) {
      throw new Error(payload?.message || "Unable to load products.");
    }

    return extractProductList(payload).map((product) => normalizeProduct(product)).filter(Boolean);
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to load products."));
  }
}

export async function getProductById(productId) {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    const payload = response.data;
    const productData = payload?.data || payload?.product || payload;

    if (payload?.success === false) {
      throw new Error(payload?.message || "Unable to load the product.");
    }

    return normalizeProduct(productData);
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to load the product."));
  }
}

export async function createProduct(payload) {
  try {
    const response = await apiClient.post("/products", payload);
    const normalizedResponse = normalizeMutationResponse(response.data, "Product created.");

    if (normalizedResponse.success === false) {
      throw new Error(normalizedResponse.message || "Unable to create product.");
    }

    return normalizedResponse;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to create product."));
  }
}

export async function updateProduct(productId, payload) {
  try {
    const response = await apiClient.put(`/products/${productId}`, payload);
    const normalizedResponse = normalizeMutationResponse(response.data, "Product updated.");

    if (normalizedResponse.success === false) {
      throw new Error(normalizedResponse.message || "Unable to update product.");
    }

    return normalizedResponse;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to update product."));
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await apiClient.delete(`/products/${productId}`);
    const payload = response.data || {};

    if (payload.success === false) {
      throw new Error(payload.message || "Unable to delete product.");
    }

    return {
      success: payload.success ?? true,
      message: payload.message || "Product deleted.",
    };
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to delete product."));
  }
}

