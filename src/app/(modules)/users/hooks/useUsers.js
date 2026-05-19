"use client";

import { useCallback, useEffect, useState } from "react";
import {
	createUser as createUserRequest,
	deleteUser as deleteUserRequest,
	getUsers,
	updateUser as updateUserRequest,
} from "../services/userService";

function getErrorMessage(error, fallbackMessage) {
	return error?.message || fallbackMessage;
}

export function useUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const fetchUsers = useCallback(async () => {
		try {
			setLoading(true);
			setError("");
			const data = await getUsers();
			setUsers(data);
		} catch (err) {
			setError(getErrorMessage(err, "Failed to fetch users."));
		} finally {
			setLoading(false);
		}
	}, []);

	const runMutation = useCallback(
		async (mutation, fallbackMessage) => {
			try {
				setIsSubmitting(true);
				const result = await mutation();
				await fetchUsers();
				return result;
			} catch (err) {
				throw new Error(getErrorMessage(err, fallbackMessage));
			} finally {
				setIsSubmitting(false);
			}
		},
		[fetchUsers],
	);

	const createUser = useCallback(
		async (payload) => runMutation(() => createUserRequest(payload), "Failed to create user."),
		[runMutation],
	);

	const updateUser = useCallback(
		async (id, payload) => runMutation(() => updateUserRequest(id, payload), "Failed to update user."),
		[runMutation],
	);

	const deleteUser = useCallback(
		async (id) => runMutation(() => deleteUserRequest(id), "Failed to delete user."),
		[runMutation],
	);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return {
		users,
		loading,
		error,
		isSubmitting,
		fetchUsers,
		createUser,
		updateUser,
		deleteUser,
	};
}
