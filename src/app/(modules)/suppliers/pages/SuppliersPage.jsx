"use client";

// Purpose: This module handles suppliers logic and UI.

import { useMemo, useState } from "react";
import { useSuppliers } from "../hooks/useSuppliers"; 
import { Edit2, Trash2, FileText } from "lucide-react";

const supplierDisplayById = {
  "sup-001": {
    name: "TechSource Ltd",
    phone: "+20 123-456-7890",
    email: "sales@techsource.com",
    status: "Active",
  },
  "sup-002": {
    name: "Global Electronics",
    phone: "+20 987-654-3210",
    email: "info@globalelec.com",
    status: "Inactive",
  },
  "sup-003": {
    name: "Nile Trading Co.",
    phone: "+20 112-233-4455",
    email: "contact@niletrading.com",
    status: "Active",
  },
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
  const { suppliers, isLoading, error } = useSuppliers();
  const [expandedSupplierId, setExpandedSupplierId] = useState("sup-001");

  // Compute derived suppliers data from current state.
  const suppliersWithUiData = useMemo(() => {
    return suppliers.map((supplier) => {
      const display = supplierDisplayById[supplier.id] || {};

      return {
        ...supplier,
        name: display.name || supplier.name,
        phone: display.phone || supplier.phone,
        contactEmail: display.email || supplier.contactEmail,
        status: display.status || "Active",
        purchaseHistory: purchaseHistoryBySupplierId[supplier.id] || [],
      };
    });
  }, [suppliers]);

  // Handle local suppliers events and state updates.
  const handleToggleExpand = (supplierId) => {
    setExpandedSupplierId((prev) => (prev === supplierId ? null : supplierId));
  };

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl rounded-[48px] border border-blue-900/55 bg-linear-to-br from-[#071333] via-[#08163f] to-[#030d27] p-6 shadow-[0_40px_90px_rgba(2,7,30,0.75)] sm:p-8">
        <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-white">Suppliers</h1>

        {isLoading ? <p className="text-sm text-slate-300">Loading suppliers...</p> : null}

        {!isLoading && error ? <p className="text-sm text-rose-300">{error}</p> : null}

        {!isLoading && !error ? (
          <div className="space-y-3">
            {suppliersWithUiData.map((supplier) => {
              const isExpanded = expandedSupplierId === supplier.id;

              return (
                <article
                  key={supplier.id}
                  onClick={() => handleToggleExpand(supplier.id)}
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
                      <p>{supplier.contactEmail}</p>
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
                      <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex h-6 min-w-10 items-center justify-center rounded-md bg-teal-500 px-2 text-xs text-white transition hover:bg-teal-400"
                        title="Edit"
                        aria-label="Edit supplier"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {isExpanded ? (
                        <button
                          type="button"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex h-6 min-w-10 items-center justify-center rounded-md bg-rose-500 px-2 text-xs text-white transition hover:bg-rose-400"
                          title="Delete"
                          aria-label="Delete supplier"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex h-6 min-w-10 items-center justify-center rounded-md bg-indigo-500 px-2 text-xs text-white transition hover:bg-indigo-400"
                        title="View Purchases"
                        aria-label="View purchases"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="border-t border-blue-700/35 bg-[#0f1d47]/65 px-5 pb-3 pt-2">
                      <h2 className="mb-2 text-lg font-bold text-slate-100">Purchase History</h2>

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
    </section>
  );
}

