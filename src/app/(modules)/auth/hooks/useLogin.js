"use client";

// Purpose: This module handles authentication logic and UI.
console.log("useLogin hook loaded");

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services/authService";

const initialForm = {
	email: "",
	password: "",
	remember: false,
};

// Expose reusable authentication logic for other modules.
export function useLogin() {
	const router = useRouter();
	const [form, setForm] = useState(initialForm);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [status, setStatus] = useState("idle");
	const [message, setMessage] = useState("");

	// Handle local authentication events and state updates.
	const handleChange = (event) => {
		const { name, value, type, checked } = event.target;

		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	// Handle local authentication events and state updates.
	const validate = () => {
		const nextErrors = {};

		if (!form.email.trim()) {
			nextErrors.email = "Email is required.";
		} else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
			nextErrors.email = "Enter a valid email address.";
		}

		if (!form.password) {
			nextErrors.password = "Password is required.";
		} else if (form.password.length < 6) {
			nextErrors.password = "Password must be at least 6 characters.";
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validate()) {
			setStatus("error");
			setMessage("Please fix the highlighted fields.");
			return;
		}

		try {
			setIsSubmitting(true);
			setStatus("idle");
			setMessage("");

			const response = await login({
				email: form.email.trim(),
				password: form.password,
				remember: form.remember,
			});

			setStatus("success");
			setMessage(response.message || "Logged in successfully.");
			router.replace("/products");
		} catch (error) {
			setStatus("error");
			setMessage(error.message || "Login failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		form,
		errors,
		isSubmitting,
		status,
		message,
		handleChange,
		handleSubmit,
	};
}

