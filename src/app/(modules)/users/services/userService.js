import apiClient from "../../../../lib/apiClient";
import { normalizeUserRole } from "../../../../lib/userRoles";

function normalizeErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || error?.message || fallbackMessage;
}

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    ...user,
    id: user._id || user.id,
    _id: user._id || user.id,
    role: normalizeUserRole(user.role),
  };
}

function extractUserList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.users)) {
    return payload.users;
  }

  if (Array.isArray(payload?.data?.users)) {
    return payload.data.users;
  }

  return [];
}

function normalizeSuccessResponse(payload, fallbackMessage) {
  const data = payload?.data || payload || {};
  const userData = data?.data || data?.user || data;

  return {
    success: data.success ?? true,
    message: data.message || fallbackMessage,
    data: normalizeUser(userData),
  };
}

export async function getUsers() {
  try {
    const response = await apiClient.get("/users");
    const payload = response.data;
    const isSuccessful = payload?.success ?? (response.status >= 200 && response.status < 300);

    if (isSuccessful === false) {
      throw new Error(payload?.message || "Unable to load users.");
    }

    return extractUserList(payload).map((user) => normalizeUser(user)).filter(Boolean);
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to load users."));
  }
}

export async function getUserById(userId) {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    const payload = response.data;
    const userData = payload?.data || payload?.user || payload;

    if (payload?.success === false) {
      throw new Error(payload?.message || "Unable to load the user.");
    }

    return normalizeUser(userData);
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to load the user."));
  }
}

export async function createUser(payload) {
  try {
    const response = await apiClient.post("/users", payload);
    const normalizedResponse = normalizeSuccessResponse(response.data, "User created.");

    if (normalizedResponse.success === false) {
      throw new Error(normalizedResponse.message || "Unable to create user.");
    }

    return normalizedResponse;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to create user."));
  }
}

export async function updateUser(userId, payload) {
  try {
    const response = await apiClient.put(`/users/${userId}`, payload);
    const normalizedResponse = normalizeSuccessResponse(response.data, "User updated.");

    if (normalizedResponse.success === false) {
      throw new Error(normalizedResponse.message || "Unable to update user.");
    }

    return normalizedResponse;
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to update user."));
  }
}

export async function deleteUser(userId) {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    const payload = response.data || {};

    if (payload.success === false) {
      throw new Error(payload.message || "Unable to delete user.");
    }

    return {
      success: payload.success ?? true,
      message: payload.message || "User deleted.",
    };
  } catch (error) {
    throw new Error(normalizeErrorMessage(error, "Unable to delete user."));
  }
}
