"use client";

import { useCallback, useEffect, useState } from "react";
import { getUsers } from "../services/userService";

export function useUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchUsers = useCallback(async () => {
		try {
			setLoading(true);
			setError("");
			const data = await getUsers();
			setUsers(data);
		} catch (err) {
			setError(err.message || "Failed to fetch users.");
		} finally {
			setLoading(false);
		}
	}, []);

	const addUser = useCallback((newUser) => {
		setUsers((prev) => {
			const id = prev.length > 0 ? Math.max(...prev.map((item) => Number(item.id) || 0)) + 1 : 1;
			return [...prev, { id, ...newUser }];
		});
	}, []);

	const editUser = useCallback((id, updates) => {
		setUsers((prev) =>
			prev.map((user) => {
				if (user.id !== id) {
					return user;
				}
				return { ...user, ...updates };
			}),
		);
	}, []);

	const deleteUser = useCallback((id) => {
		setUsers((prev) => prev.filter((user) => user.id !== id));
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return {
		users,
		loading,
		error,
		fetchUsers,
		addUser,
		editUser,
		deleteUser,
	};
}
