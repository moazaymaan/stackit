// Purpose: This module handles authentication logic and UI.

import Link from "next/link";

export const metadata = {
	title: "Register",
	description: "Create your account",
};

export default function RegisterPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
			<section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Account setup</p>
				<h1 className="mt-4 text-3xl font-bold text-white">Registration not enabled yet</h1>
				<p className="mt-3 text-sm leading-6 text-slate-300">
					The backend integration currently covers login and profile retrieval. Use the login page to continue.
				</p>
				<Link
					href="/auth/pages/login"
					className="mt-6 inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
				>
					Back to login
				</Link>
			</section>
		</main>
	);
}


