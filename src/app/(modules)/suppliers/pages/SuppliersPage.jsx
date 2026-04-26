"use client";

// Purpose: This module handles suppliers logic and UI.

import { useMemo, useState } from "react";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { useSuppliers } from "../hooks/useSuppliers";

const EMPTY_SUPPLIER_FORM = {
  name: "",
  phone: "",
  address: "",
};

const purchaseHistoryBySupplierId = {
  "sup-001": [
    {
      id: "po-1023",
      date: "2023-11-15",
      poNumber: "PO-1023",
      quantity: "150 units",
      amount: "$3,200.00",
    },
    {
      id: "po-0984",
      date: "2023-09-28",
      poNumber: "PO-0984",
      quantity: "300 units",
      amount: "$7,500.00",
    },
    {
      id: "po-0871",
      date: "2023-07-12",
      poNumber: "PO-0871",
      quantity: "200 units",
      amount: "$4,800.00",
    },
  ],
  "sup-002": [
    {
      id: "po-1091",
      date: "2023-12-05",
      poNumber: "PO-1091",
      quantity: "95 units",
      amount: "$2,140.00",
    },
    {
      id: "po-1062",
      date: "2023-10-11",
      poNumber: "PO-1062",
      quantity: "160 units",
      amount: "$3,920.00",
    },
  ],
  "sup-003": [
    {
      id: "po-1110",
      date: "2023-12-20",
      poNumber: "PO-1110",
      quantity: "110 units",
      amount: "$3,300.00",
    },
    {
      id: "po-1045",
      date: "2023-08-09",
      poNumber: "PO-1045",
      quantity: "250 units",
      amount: "$6,840.00",
    },
  ],
};

// Render the main suppliers component.
export default function SuppliersPage() {
  // Read suppliers data and actions from a custom hook.
  const {
    suppliers,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
  } = useSuppliers();
  const [expandedSupplierId, setExpandedSupplierId] = useState("");
  const [actionError, setActionError] = useState("");
  const [modalType, setModalType] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_SUPPLIER_FORM);
  const [formError, setFormError] = useState("");

  // Compute derived suppliers data from current state.
  const suppliersWithUiData = useMemo(() => {
    return suppliers.map((supplier) => {
      return {
        ...supplier,
        status: supplier.status || "Active",
        purchaseHistory: purchaseHistoryBySupplierId[supplier.id] || [],
      };
    });
  }, [suppliers]);

  const expandedSupplier = suppliersWithUiData.find((supplier) => supplier.id === expandedSupplierId) || null;

  // Handle local suppliers events and state updates.
  const handleToggleExpand = async (supplier) => {
    if (!canRead) {
      return;
    }

    try {
      setActionError("");
      const details = await getSupplierById(supplier.id);
      const nextSupplierId = details?.id || supplier.id;
      setExpandedSupplierId((prev) => (prev === nextSupplierId ? null : nextSupplierId));
    } catch (err) {
      setActionError(err.message || "Unable to load supplier details.");
    }
  };

  const closeModal = () => {
    setModalType("");
    setSelectedSupplier(null);
    setFormValues(EMPTY_SUPPLIER_FORM);
    setFormError("");
  };

  const openAddModal = () => {
    if (!canCreate) {
      return;
    }

    setActionError("");
    setFormError("");
    setFormValues(EMPTY_SUPPLIER_FORM);
    setModalType("add");
  };

  const openEditModal = (supplier) => {
    if (!canUpdate) {
      return;
    }

    setActionError("");
    setFormError("");
    setSelectedSupplier(supplier);
    setFormValues({
      name: supplier.name || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    });
    setModalType("edit");
  };

  const openDeleteModal = (supplier) => {
    if (!canDelete) {
      return;
    }

    setActionError("");
    setFormError("");
    setSelectedSupplier(supplier);
    setModalType("delete");
  };

  const handleFormFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formValues.name.trim()) {
      setFormError("Supplier name is required.");
      return false;
    }

    if (!formValues.address.trim()) {
      setFormError("Address is required.");
      return false;
    }

    const digitsOnlyPhone = String(formValues.phone || "").replace(/\D/g, "");
    if (digitsOnlyPhone && digitsOnlyPhone.length < 9) {
      setFormError("Phone number is too short.");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleSubmitAdd = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setActionError("");
      await createSupplier({
        name: formValues.name.trim(),
        phone: formValues.phone.trim(),
        address: formValues.address.trim(),
      });
      closeModal();
    } catch (err) {
      setActionError(err.message || "Unable to create supplier.");
    }
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    if (!selectedSupplier) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setActionError("");
      await updateSupplier(selectedSupplier.id, {
        name: formValues.name.trim(),
        phone: formValues.phone.trim(),
        address: formValues.address.trim(),
      });
      closeModal();
    } catch (err) {
      setActionError(err.message || "Unable to update supplier.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSupplier) {
      return;
    }

    try {
      setActionError("");
      await deleteSupplier(selectedSupplier.id);

      if (expandedSupplierId === selectedSupplier.id) {
        setExpandedSupplierId("");
      }

      closeModal();
    } catch (err) {
      setActionError(err.message || "Unable to delete supplier.");
    }
  };

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl rounded-[48px] border border-blue-900/55 bg-linear-to-br from-[#071333] via-[#08163f] to-[#030d27] p-6 shadow-[0_40px_90px_rgba(2,7,30,0.75)] sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Suppliers</h1>
          {canCreate ? (
            <button
              type="button"
              onClick={openAddModal}
              disabled={isSubmitting}
              className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Add Supplier
            </button>
          ) : null}
        </div>

        {successMessage ? <p className="mb-3 text-sm text-emerald-300">{successMessage}</p> : null}
        {actionError ? <p className="mb-3 text-sm text-rose-300">{actionError}</p> : null}

        {isLoading ? <p className="text-sm text-slate-300">Loading suppliers...</p> : null}

        {!isLoading && error && !actionError ? <p className="text-sm text-rose-300">{error}</p> : null}

        {!isLoading && !error ? (
          <div className="space-y-3">
            {suppliersWithUiData.map((supplier) => {
              const isExpanded = expandedSupplierId === supplier.id;

              return (
                <article
                  key={supplier.id}
                  onClick={() => handleToggleExpand(supplier)}
                  className="cursor-pointer overflow-hidden rounded-xl border border-blue-700/35 bg-linear-to-r from-[#14285c]/85 via-[#112251]/85 to-[#172d64]/85 shadow-[0_12px_25px_rgba(0,0,0,0.35)] transition hover:border-blue-500/45"
                >
                  <div className="flex w-full flex-col gap-3 px-5 py-3.5 md:flex-row md:items-center md:justify-between">
                    <div className="md:min-w-52">
                      <p className="text-[31px] font-extrabold leading-none text-sky-400 md:text-xl">
                        {supplier.name}
                      </p>
                    </div>

                    <div className="flex-1 text-sm font-semibold text-slate-300 md:flex md:items-center md:gap-8">
                      <p>{supplier.phone}</p>
                      <p>{supplier.address || "No address"}</p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          supplier.status === "Active"
                            ? "bg-emerald-500 text-emerald-50"
                            : "bg-rose-500 text-rose-50"
                        }`}
                      >
                        {supplier.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      {canRead ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleToggleExpand(supplier);
                          }}
                          className="inline-flex h-6 min-w-10 items-center justify-center rounded-md bg-indigo-500 px-2 text-xs text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                          title="View"
                          aria-label="View supplier"
                          disabled={isSubmitting}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      ) : null}

                      {canUpdate ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditModal(supplier);
                          }}
                          className="inline-flex h-6 min-w-10 items-center justify-center rounded-md bg-teal-500 px-2 text-xs text-white transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Edit"
                          aria-label="Edit supplier"
                          disabled={isSubmitting}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      ) : null}

                      {canDelete ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openDeleteModal(supplier);
                          }}
                          className="inline-flex h-6 min-w-10 items-center justify-center rounded-md bg-rose-500 px-2 text-xs text-white transition hover:bg-rose-400"
                          title="Delete"
                          aria-label="Delete supplier"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {isExpanded && expandedSupplier?.id === supplier.id ? (
                    <div className="border-t border-blue-700/35 bg-[#0f1d47]/65 px-5 pb-3 pt-2">
                      <h2 className="mb-2 text-lg font-bold text-slate-100">Purchase History</h2>
                      <p className="mb-2 text-sm text-slate-300">Address: {supplier.address || "No address"}</p>

                      <div className="overflow-x-auto rounded-md border border-blue-700/30 bg-[#0b183d]/45">
                        <table className="min-w-full text-left text-sm text-slate-200">
                          <thead className="text-sm font-semibold text-slate-300">
                            <tr>
                              <th className="px-3 py-2">Date</th>
                              <th className="px-3 py-2">PO Number</th>
                              <th className="px-3 py-2">Quantity</th>
                              <th className="px-3 py-2">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {supplier.purchaseHistory.map((purchase) => (
                              <tr key={purchase.id} className="border-t border-blue-800/35">
                                <td className="px-3 py-2">{purchase.date}</td>
                                <td className="px-3 py-2 font-medium">{purchase.poNumber}</td>
                                <td className="px-3 py-2">{purchase.quantity}</td>
                                <td className="px-3 py-2">{purchase.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </div>

      {modalType === "add" || modalType === "edit" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-blue-700/45 bg-[#0f1d47] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <h2 className="text-xl font-bold text-slate-100">
              {modalType === "add" ? "Add Supplier" : "Edit Supplier"}
            </h2>

            <form
              className="mt-4 space-y-3"
              onSubmit={modalType === "add" ? handleSubmitAdd : handleSubmitEdit}
            >
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-200">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleFormFieldChange}
                  className="w-full rounded-md border border-blue-600/50 bg-[#0b183d] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-200">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleFormFieldChange}
                  className="w-full rounded-md border border-blue-600/50 bg-[#0b183d] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-200">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  value={formValues.address}
                  onChange={handleFormFieldChange}
                  className="w-full rounded-md border border-blue-600/50 bg-[#0b183d] px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                />
              </div>

              {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-slate-500/70 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {modalType === "add" ? "Create" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {modalType === "delete" && selectedSupplier ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-700/45 bg-[#281030] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
            <h2 className="text-xl font-bold text-rose-100">Delete Supplier</h2>
            <p className="mt-3 text-sm text-rose-100/90">
              Are you sure you want to delete {selectedSupplier.name}?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md border border-slate-500/70 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="rounded-md bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

