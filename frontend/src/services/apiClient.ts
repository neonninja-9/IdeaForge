/**
 * API Client
 * ----------
 * Shared fetch wrapper with automatic auth token injection.
 * Reuses the same pattern as authService but generalized for all endpoints.
 */

const API_BASE = "/api/v1";

/**
 * Get the current access token from the auth context.
 * This is set by the AuthContext after login/refresh.
 */
let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

/**
 * Generic fetch wrapper with error handling.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (_accessToken) {
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const body = await res.json();

  if (!res.ok) {
    const error = new Error(body.message || "Something went wrong") as Error & {
      status: number;
      validationErrors?: { field: string; message: string }[];
    };
    error.status = res.status;
    error.validationErrors = body.errors;
    throw error;
  }

  return body as T;
}
