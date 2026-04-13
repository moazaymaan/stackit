// Purpose: This module handles authentication logic and UI.

import LoginForm from "../../components/LoginForm";

export const metadata = {
	title: "Login",
	description: "Sign in to your account",
};

// Render the main authentication component.
export default function LoginPage() {
	// Render the JSX layout for this section.
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
			<section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur lg:grid-cols-[1.1fr,1fr]">
				<div className="relative border-b border-white/10 px-7 pb-5 pt-7 sm:p-10 lg:border-b-0 lg:border-r">
				
					<div className="absolute -bottom-10 left-10 h-44 w-44 rounded-full bg-indigo-500/30 blur-3xl" />
					<div className="relative z-10">
						<p className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
							Developer Platform
						</p>
						<h1 className="mt-6 text-4xl font-black uppercase tracking-[0.22em] text-white sm:text-5xl">
							Stackit
						</h1>
					</div>
				</div>

				<div className="px-7 pb-7 pt-4 sm:p-10">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
						Welcome back
					</p>
					<h2 className="mt-1.5 text-2xl font-bold text-white">Login to your workspace</h2>
					<div className="mt-4">
						<LoginForm />
					</div>
				</div>
			</section>
		</main>
	);
}

