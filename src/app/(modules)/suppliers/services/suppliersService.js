// Purpose: This module handles suppliers logic and UI.

import suppliersMock from "../../../../mock/suppliers";

let suppliersStore = suppliersMock.map((item) => ({ ...item }));

// Process helper logic for suppliers data and behavior.
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getSuppliers() {
  await delay(250);
  return suppliersStore.map((item) => ({ ...item }));
}

export async function getSupplierById(supplierId) {
  await delay(150);
  return suppliersStore.find((item) => item.id === supplierId) || null;
}

export async function createSupplier(payload) {
  await delay(200);

  const newSupplier = {
    id: `sup-${Date.now()}`,
    ...payload,
  };

  suppliersStore = [newSupplier, ...suppliersStore];
  return { ...newSupplier };
}

export async function updateSupplier(supplierId, updates) {
  await delay(200);

  suppliersStore = suppliersStore.map((item) => {
    if (item.id !== supplierId) {
      return item;
    }

    return { ...item, ...updates };
  });

  return suppliersStore.find((item) => item.id === supplierId) || null;
}

export async function deleteSupplier(supplierId) {
  await delay(200);

  const exists = suppliersStore.some((item) => item.id === supplierId);
  suppliersStore = suppliersStore.filter((item) => item.id !== supplierId);

  return { success: exists };
}

