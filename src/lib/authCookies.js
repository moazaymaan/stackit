// Purpose: This module handles shared utilities logic and UI.

import Cookies from "js-cookie";

export const AUTH_TOKEN_COOKIE = "stackit_auth_token";

// Expose reusable shared utilities logic for other modules.
export function setAuthToken(token, days = 7) {
  Cookies.set(AUTH_TOKEN_COOKIE, token, {
    expires: days,
    sameSite: "strict",
  });
}

// Expose reusable shared utilities logic for other modules.
export function getAuthToken() {
  return Cookies.get(AUTH_TOKEN_COOKIE) || "";
}

// Expose reusable shared utilities logic for other modules.
export function clearAuthToken() {
  Cookies.remove(AUTH_TOKEN_COOKIE);
}

