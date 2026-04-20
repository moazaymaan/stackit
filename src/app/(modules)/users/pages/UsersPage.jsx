"use client";

import { useState } from "react";
import { Plus, Users, ShieldCheck, User, Warehouse, Calculator } from "lucide-react";
import UsersList from "../components/UsersList";
import { useUsers } from "../hooks/useUsers";
import { USER_ROLE_OPTIONS, normalizeUserRole } from "../../../../lib/userRoles";

export default function UsersPage() {
	const { users, loading, error, isSubmitting, createUser, updateUser, deleteUser } = useUsers();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formMode, setFormMode] = useState("create");
	const [editingUser, setEditingUser] = useState(null);
	const [deleteTargetUser, setDeleteTargetUser] = useState(null);
	const [deleteConfirmText, setDeleteConfirmText] = useState("");
	const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "USER" });
	const [formError, setFormError] = useState("");
	const [actionError, setActionError] = useState("");

	const adminsCount = users.filter((entry) => normalizeUserRole(entry.role) === "ADMIN").length;
	const accountantsCount = users.filter((entry) => normalizeUserRole(entry.role) === "ACCOUNTANT").length;
	const warehouseCount = users.filter((entry) => normalizeUserRole(entry.role) === "WAREHOUSE").length;
	const usersCount = users.filter((entry) => normalizeUserRole(entry.role) === "USER").length;

	const resetForm = (mode, user = null) => {
		setFormMode(mode);
		setEditingUser(user);
		setFormError("");

		if (mode === "edit" && user) {
			setFormData({
				name: user.name || "",
				email: user.email || "",
				password: "",
				role: normalizeUserRole(user.role) || "USER",
			});
			return;
		}

		setFormData({
			name: "",
			email: "",
			password: "",
			role: "USER",
		});
	};

	const handleOpenCreateModal = () => {
		setActionError("");
		resetForm("create");
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (user) => {
		setActionError("");
		resetForm("edit", user);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingUser(null);
		setFormError("");
	};

	const handleOpenDeleteModal = (user) => {
		setActionError("");
		setDeleteTargetUser(user);
		setDeleteConfirmText("");
	};

	const handleCloseDeleteModal = () => {
		setDeleteTargetUser(null);
		setDeleteConfirmText("");
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateForm = () => {
		if (!formData.name.trim()) {
			setFormError("Name is required.");
			return false;
		}

		if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
			setFormError("Please enter a valid email address.");
			return false;
		}

		if (formMode === "create" && !formData.password.trim()) {
			setFormError("Password is required for a new user.");
			return false;
		}

		if (!formData.role.trim()) {
			setFormError("Role is required.");
			return false;
		}

		return true;
	};

	const handleSubmitUser = async (event) => {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		setFormError("");

		try {
			if (formMode === "create") {
				await createUser({
					name: formData.name.trim(),
					email: formData.email.trim(),
					password: formData.password,
					role: normalizeUserRole(formData.role),
				});
			} else if (editingUser) {
				await updateUser(editingUser._id || editingUser.id, {
					name: formData.name.trim(),
					email: formData.email.trim(),
					role: normalizeUserRole(formData.role),
				});
			}

			handleCloseModal();
		} catch (error) {
			setFormError(error.message || "Unable to save user.");
		}
	};

	const handleSubmitDelete = async (event) => {
		event.preventDefault();

		if (!deleteTargetUser) {
			return;
		}

		if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
			setActionError('Type DELETE to confirm removal.');
			return;
		}

		try {
			setActionError("");
			await deleteUser(deleteTargetUser._id || deleteTargetUser.id);
			handleCloseDeleteModal();
		} catch (error) {
			setActionError(error.message || "Unable to delete user.");
		}
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
						onClick={handleOpenCreateModal}
						className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition hover:from-sky-400 hover:to-cyan-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.55)]"
					>
						<Plus size={16} />
						Add User
					</button>
				</div>

				{actionError ? (
					<div className="mb-4 rounded-xl border border-rose-700/45 bg-rose-950/35 px-4 py-3 text-sm text-rose-300">
						{actionError}
					</div>
				) : null}

				<div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
							<Calculator className="h-4 w-4" />
							Accountants
						</p>
						<p className="mt-1 text-2xl font-extrabold text-indigo-100">{accountantsCount}</p>
					</div>

					<div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
						<p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
							<Warehouse className="h-4 w-4" />
							Warehouse
						</p>
						<p className="mt-1 text-2xl font-extrabold text-emerald-100">{warehouseCount}</p>
					</div>

					<div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
						<p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
							<User className="h-4 w-4" />
							Users
						</p>
						<p className="mt-1 text-2xl font-extrabold text-emerald-100">{usersCount}</p>
					</div>
				</div>

				<UsersList
					users={users}
					loading={loading}
					error={error}
					isSubmitting={isSubmitting}
					onEditRequest={handleOpenEditModal}
					onDelete={handleOpenDeleteModal}
				/>
			</div>

			{isModalOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
					<div className="w-full max-w-md rounded-2xl border border-blue-700/45 bg-linear-to-br from-[#0f1f56] via-[#101d48] to-[#061338] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
						<h2 className="text-xl font-bold text-white">{formMode === "create" ? "Create User" : "Edit User"}</h2>
						<p className="mt-1 text-sm text-slate-300">
							{formMode === "create" ? "Add a new platform user." : "Update user information and save changes."}
						</p>

						<form onSubmit={handleSubmitUser} className="mt-4 space-y-3">
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

							{formMode === "create" ? (
								<div>
									<label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-200">
										Password
									</label>
									<input
										id="password"
										name="password"
										type="password"
										value={formData.password}
										onChange={handleChange}
										className="w-full rounded-lg border border-blue-700/45 bg-[#0a1a45]/75 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
									/>
								</div>
							) : null}

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
									{USER_ROLE_OPTIONS.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>

							{formError ? <p className="text-sm text-rose-300">{formError}</p> : null}

							<div className="mt-2 flex justify-end gap-2">
								<button
									type="button"
									onClick={handleCloseModal}
									className="rounded-lg border border-blue-700/45 bg-[#0a1a45]/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-[#102555]"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className="rounded-lg bg-linear-to-r from-sky-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
								>
									{isSubmitting ? "Saving..." : formMode === "create" ? "Create User" : "Save Changes"}
								</button>
							</div>
						</form>
					</div>
				</div>
			) : null}

			{deleteTargetUser ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
					<div className="w-full max-w-sm rounded-2xl border border-rose-700/45 bg-linear-to-br from-[#2a1020] via-[#1d1020] to-[#0f1328] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
						<h2 className="text-xl font-bold text-white">Delete User</h2>
						<p className="mt-1 text-sm text-slate-300">
							This removes <span className="font-semibold text-rose-200">{deleteTargetUser.name}</span> permanently.
						</p>

						<form onSubmit={handleSubmitDelete} className="mt-4 space-y-3">
							<div>
								<label htmlFor="deleteConfirmText" className="mb-1 block text-sm font-medium text-slate-200">
									Type DELETE to confirm
								</label>
								<input
									id="deleteConfirmText"
									name="deleteConfirmText"
									value={deleteConfirmText}
									onChange={(event) => setDeleteConfirmText(event.target.value)}
									className="w-full rounded-lg border border-rose-700/45 bg-[#220f1a]/80 px-3 py-2 text-sm text-white outline-none transition focus:border-rose-400"
								/>
							</div>

							{actionError ? <p className="text-sm text-rose-300">{actionError}</p> : null}

							<div className="mt-2 flex justify-end gap-2">
								<button
									type="button"
									onClick={handleCloseDeleteModal}
									className="rounded-lg border border-blue-700/45 bg-[#0a1a45]/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-[#102555]"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className="rounded-lg bg-linear-to-r from-rose-500 to-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
								>
									{isSubmitting ? "Deleting..." : "Delete User"}
								</button>
							</div>
						</form>
					</div>
				</div>
			) : null}
		</section>
	);
}
