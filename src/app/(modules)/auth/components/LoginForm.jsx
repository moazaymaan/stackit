"use client";

// Purpose: This module handles authentication logic and UI.

import { useLogin } from "../hooks/useLogin";
import { Mail, Lock, CheckSquare } from "lucide-react";

// Render the main authentication component.
export default function LoginForm() {
	const {
		form,
		errors,
		isSubmitting,
		handleChange,
		handleSubmit,
	} = useLogin();

	return (
		<form onSubmit={handleSubmit} className="space-y-4" noValidate>
			<div>
				<label
					htmlFor="email"
					className="mb-1 block text-sm font-medium text-slate-200"
				>
					Email
				</label>
				<div className="relative">
					<Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						value={form.email}
						onChange={handleChange}
						placeholder="you@example.com"
						className="w-full rounded-xl border border-white/15 bg-slate-800/70 pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30"
					/>
				</div>
				{errors.email ? (
					<p className="mt-1 text-xs text-rose-400">{errors.email}</p>
				) : null}
			</div>

			<div>
				<label
					htmlFor="password"
					className="mb-1 block text-sm font-medium text-slate-200"
				>
					Password
				</label>
				<div className="relative">
					<Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						value={form.password}
						onChange={handleChange}
						placeholder="Enter your password"
						className="w-full rounded-xl border border-white/15 bg-slate-800/70 pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30"
					/>
				</div>
				{errors.password ? (
					<p className="mt-1 text-xs text-rose-400">{errors.password}</p>
				) : null}
			</div>

			<label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
				<div className="relative">
					<input
						name="remember"
						type="checkbox"
						checked={form.remember}
						onChange={handleChange}
						className="h-4 w-4 appearance-none rounded border-slate-500 bg-slate-800 text-cyan-300 focus:ring-cyan-300 cursor-pointer accent-cyan-300"
					/>
					{form.remember && <CheckSquare className="absolute left-0 top-0 h-4 w-4 text-cyan-300 pointer-events-none" />}
				</div>
				Remember me
			</label>

			<div className="flex justify-center">
				<button
					type="submit"
					disabled={isSubmitting}
					className="inline-flex min-w-36 items-center justify-center rounded-xl bg-linear-to-r from-cyan-400 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-300 hover:to-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isSubmitting ? "Signing in..." : "Sign in"}
				</button>
			</div>

		</form>
	);
}

