// Purpose: This module handles authentication logic and UI.

import apiClient from "../../../../lib/apiClient";
import { clearAuthToken, setAuthToken } from "../../../../lib/authCookies";

function normalizeAuthPayload(payload) {
	const data = payload?.data || payload || {};
	const authData = data?.data || {};
	const token = authData.token || data.token || "";
	const user = authData.user || data.user || null;

	return {
		success: data.success ?? Boolean(token),
		message: data.message || "Logged in successfully.",
		token,
		user,
		data: authData.token || authData.user ? authData : { token, user },
	};
}

export async function login(payload) {
	try {
		const response = await apiClient.post("/auth/login", {
			email: payload.email,
			password: payload.password,
		});

		const normalized = normalizeAuthPayload(response.data);

		if (normalized.token) {
			setAuthToken(normalized.token, payload.remember ? 30 : 7);
		}

		return normalized;
	} catch (error) {
		const message = error?.response?.data?.message || error?.message || "Unable to login right now.";
		throw new Error(message);
	}
}

export async function getCurrentUser() {
	try {
		const response = await apiClient.get("/auth/me");
		const data = response.data || {};
		const currentUser = data.data?.user || data.data || data.user || null;

		return {
			success: data.success ?? true,
			message: data.message || "Profile loaded successfully.",
			user: currentUser,
			data: data.data ?? currentUser,
		};
	} catch (error) {
		const message = error?.response?.data?.message || error?.message || "Unable to load the current user.";
		throw new Error(message);
	}
}

// Expose reusable authentication logic for other modules.
export function logout() {
	clearAuthToken();
	return { success: true };
}

