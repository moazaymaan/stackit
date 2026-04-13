// Purpose: This module handles authentication logic and UI.

import apiClient from "../../../../lib/apiClient";
import { clearAuthToken, setAuthToken } from "../../../../lib/authCookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || "";

// Process helper logic for authentication data and behavior.
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function mockLogin({ email }) {
	await delay(700);
	const token = "mock-token";

	setAuthToken(token);

	return {
		user: {
			id: "mock-user-1",
			email,
			name: "Frontend User",
		},
		token,
		message: "Frontend mock login success. Backend can be connected anytime.",
	};
}

export async function login(payload) {
	// If backend URL is not configured yet, keep frontend flow unblocked.
	if (!API_BASE_URL) {
		return mockLogin(payload);
	}

	let data = null;

	try {
		const response = await apiClient.post(`${API_BASE_URL}/auth/login`, payload);
		data = response.data;
	} catch (error) {
		throw new Error(error?.response?.data?.message || "Unable to login right now.");
	}

	if (data?.token) {
		setAuthToken(data.token);
	}

	return {
		...data,
		message: data?.message || "Logged in successfully.",
	};
}

// Expose reusable authentication logic for other modules.
export function logout() {
	clearAuthToken();
	return { success: true };
}

