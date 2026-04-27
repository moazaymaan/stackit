// Purpose: This module handles purchases logic and UI.

export const PurchaseShape = {
  id: "string", // normalized from backend _id
  supplierId: "string",
  items: "array", // [{productId: string, quantity: number, price: number}]
  status: "string", // PENDING | RECEIVED | IN_TRANSIT | DELIVERED
  totalAmount: "number",
  createdAt: "string", // ISO timestamp
  updatedAt: "string", // ISO timestamp
};

