"use client";

import { Pencil, Trash2 } from "lucide-react";
import { getUserRoleBadgeClass, getUserRoleLabel } from "../../../../lib/userRoles";

export default function UsersList({ users, loading, error, isSubmitting, onEditRequest, onDelete }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-blue-800/45 bg-[#091b46]/60 px-4 py-6 text-sm text-slate-300">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-700/45 bg-rose-950/35 px-4 py-6 text-sm text-rose-300">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-blue-800/40 bg-[#0b1c47]/70 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead className="border-b border-blue-800/60 bg-[#0f2558]/75 text-cyan-300">
          <tr>
            <th className="px-5 py-3.5 font-semibold">Name</th>
            <th className="px-5 py-3.5 font-semibold">Email</th>
            <th className="px-5 py-3.5 font-semibold">Role</th>
            <th className="px-5 py-3.5 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-blue-900/65 transition-colors hover:bg-[#10295f]/75"
            >
              <td className="px-5 py-4 font-medium text-slate-100">{user.name}</td>
              <td className="px-5 py-4 text-slate-300">{user.email}</td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getUserRoleBadgeClass(
                    user.role,
                  )}`}
                >
                  {getUserRoleLabel(user.role)}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEditRequest(user)}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400"
                    title="Edit"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-md bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-400"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-300">
                No users found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
