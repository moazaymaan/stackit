const ROLE_LABELS = {
  ADMIN: "Admin",
  ACCOUNTANT: "Accountant",
  WAREHOUSE: "Warehouse",
  USER: "User",
};

const ROLE_BADGE_CLASSES = {
  ADMIN: "bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/40",
  ACCOUNTANT: "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/40",
  WAREHOUSE: "bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/40",
  USER: "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40",
};

export const USER_ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "ACCOUNTANT", label: "Accountant" },
  { value: "WAREHOUSE", label: "Warehouse" },
  { value: "USER", label: "User" },
];

export function normalizeUserRole(role) {
  return String(role || "")
    .trim()
    .toUpperCase();
}

export function getUserRoleLabel(role) {
  const normalizedRole = normalizeUserRole(role);
  return ROLE_LABELS[normalizedRole] || normalizedRole || "Unknown";
}

export function getUserRoleBadgeClass(role) {
  const normalizedRole = normalizeUserRole(role);
  return ROLE_BADGE_CLASSES[normalizedRole] || "bg-slate-500/20 text-slate-200 ring-1 ring-slate-400/40";
}

export function isAdminRole(role) {
  return normalizeUserRole(role) === "ADMIN";
}