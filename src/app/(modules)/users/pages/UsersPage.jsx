"use client";

import { useState } from "react";
import { Plus, Users, ShieldCheck, BriefcaseBusiness, User } from "lucide-react";
import UsersList from "../components/UsersList";
import { useUsers } from "../hooks/useUsers";

export default function UsersPage() {
	const { users, loading, error, addUser, editUser, deleteUser } = useUsers();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [formData, setFormData] = useState({ name: "", email: "", role: "User" });
	const [formError, setFormError] = useState("");

	const adminsCount = users.filter((entry) => entry.role === "Admin").length;
	const managersCount = users.filter((entry) => entry.role === "Manager").length;
	const usersCount = users.filter((entry) => entry.role === "User").length;

	const handleAddUser = () => {
		addUser({
			name: "New User",
			email: `new.user.${Date.now()}@example.com`,
			role: "User",
		});
	};

	const handleOpenEditModal = (user) => {
		setEditingUser(user);
		setFormData({
			name: user.name || "",
			email: user.email || "",
			role: user.role || "User",
		});
		setFormError("");
		setIsEditModalOpen(true);
	};

	const handleCloseEditModal = () => {
		setIsEditModalOpen(false);
		setEditingUser(null);
		setFormError("");
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmitEdit = (event) => {
		event.preventDefault();

		if (!editingUser) {
			return;
		}

		if (!formData.name.trim()) {
			setFormError("Name is required.");
			return;
		}

		if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
			setFormError("Please enter a valid email address.");
			return;
		}

		editUser(editingUser.id, {
			name: formData.name.trim(),
			email: formData.email.trim(),
			role: formData.role,
		});

		handleCloseEditModal();
	};

	return (
		<section className="p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-7xl rounded-[42px] border border-blue-900/55 bg-linear-to-br from-[#061330] via-[#0a1a47] to-[#04112f] p-5 shadow-[0_40px_95px_rgba(2,8,35,0.75)] sm:p-6">
				<div className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-800/45 bg-[#091b46]/60 p-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Users</h1>
						<p className="mt-1 text-sm text-slate-300">Manage platform users and role distribution</p>
					</div>

					<button
						type="button"
						onClick={handleAddUser}
						className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition hover:from-sky-400 hover:to-cyan-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.55)]"
					>
						<Plus size={16} />
						Add User
					</button>
				</div>

				<div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					<div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-3">
						<p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-300">
							<Users className="h-4 w-4" />
							Total Users
						</p>
						<p className="mt-1 text-2xl font-extrabold text-cyan-100">{users.length}</p>
					</div>

					<div className="rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-3">
						<p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-300">
							<ShieldCheck className="h-4 w-4" />
							Admins
						</p>
						<p className="mt-1 text-2xl font-extrabold text-blue-100">{adminsCount}</p>
					</div>

					<div className="rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-4 py-3">
						<p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-300">
							<BriefcaseBusiness className="h-4 w-4" />
							Managers
						</p>
						<p className="mt-1 text-2xl font-extrabold text-indigo-100">{managersCount}</p>
					</div>

					<div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
						<p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
							<User className="h-4 w-4" />
							Regular Users
						</p>
						<p className="mt-1 text-2xl font-extrabold text-emerald-100">{usersCount}</p>
					</div>
				</div>

				<UsersList
					users={users}
					loading={loading}
					error={error}
					onEditRequest={handleOpenEditModal}
					onDelete={deleteUser}
				/>
			</div>

			{isEditModalOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
					<div className="w-full max-w-md rounded-2xl border border-blue-700/45 bg-linear-to-br from-[#0f1f56] via-[#101d48] to-[#061338] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
						<h2 className="text-xl font-bold text-white">Edit User</h2>
						<p className="mt-1 text-sm text-slate-300">Update user information and save changes.</p>

						<form onSubmit={handleSubmitEdit} className="mt-4 space-y-3">
							<div>
								<label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-200">
									Name
								</label>
								<input
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="w-full rounded-lg border border-blue-700/45 bg-[#0a1a45]/75 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
								/>
							</div>

							<div>
								<label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-200">
									Email
								</label>
								<input
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full rounded-lg border border-blue-700/45 bg-[#0a1a45]/75 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
								/>
							</div>

							<div>
								<label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-200">
									Role
								</label>
								<select
									id="role"
									name="role"
									value={formData.role}
									onChange={handleChange}
									className="w-full rounded-lg border border-blue-700/45 bg-[#0a1a45]/75 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
								>
									<option value="User">User</option>
									<option value="Manager">Manager</option>
									<option value="Admin">Admin</option>
								</select>
							</div>

							{formError ? <p className="text-sm text-rose-300">{formError}</p> : null}

							<div className="mt-2 flex justify-end gap-2">
								<button
									type="button"
									onClick={handleCloseEditModal}
									className="rounded-lg border border-blue-700/45 bg-[#0a1a45]/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-[#102555]"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="rounded-lg bg-linear-to-r from-sky-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
								>
									Save Changes
								</button>
							</div>
						</form>
					</div>
				</div>
			) : null}
		</section>
	);
}
