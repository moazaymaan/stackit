// Purpose: This module handles mock data logic and UI.

export const ordersMock = [
  {
    id: "ord-001",
    orderNumber: "PO-2026-001",
    supplierId: "sup-001",
    status: "In Transit",
    totalAmount: 5196,
    expectedDate: "2026-04-04",
    createdAt: "2026-03-20",
    items: [
      { productId: "prod-001", quantity: 4, unitPrice: 1299 },
    ],
  },
  {
    id: "ord-002",
    orderNumber: "PO-2026-002",
    supplierId: "sup-002",
    status: "Delivered",
    totalAmount: 3150,
    expectedDate: "2026-03-22",
    createdAt: "2026-03-15",
    items: [
      { productId: "prod-002", quantity: 90, unitPrice: 35 },
    ],
  },
  {
    id: "ord-003",
    orderNumber: "PO-2026-003",
    supplierId: "sup-003",
    status: "Pending",
    totalAmount: 2370,
    expectedDate: "2026-04-09",
    createdAt: "2026-03-24",
    items: [
      { productId: "prod-003", quantity: 30, unitPrice: 79 },
    ],
  },
];

export default ordersMock;

