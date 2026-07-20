/**
 * Auth Service
 * ------------
 * API layer for all authentication endpoints.
 * Maps to the backend /api/v1/auth/* routes.
 *
 * Each method returns the parsed JSON response or throws
 * with a structured error the UI can display.
 */

import type {
  AuthResponse,
  AuthErrorResponse,
  RefreshResponse,
  RegisterPayload,
  LoginPayload,
} from "../types/auth.types";

const API_BASE = "http://localhost:8080/api/v1/auth";

/**
 * Generic fetch wrapper that handles JSON parsing and error extraction.
 */
async function authFetch<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // required for httpOnly refresh cookie
    ...options,
  });

  const body = await res.json();

  if (!res.ok) {
    const err = body as AuthErrorResponse;
    const error = new Error(err.message || "Something went wrong") as Error & {
      status: number;
      validationErrors?: AuthErrorResponse["errors"];
    };
    error.status = res.status;
    error.validationErrors = err.errors;
    throw error;
  }

  return body as T;
}

const authService = {
  /**
   * POST /register — Create a new account.
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return authFetch<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * POST /login — Authenticate with identifier (username or email) + password.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    return authFetch<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * POST /refresh — Get a new access token using the refresh cookie.
   */
  async refresh(): Promise<RefreshResponse> {
    return authFetch<RefreshResponse>("/refresh", {
      method: "POST",
    });
  },

  /**
   * POST /logout — Clear the refresh token cookie.
   */
  async logout(): Promise<{ status: string; message: string }> {
    return authFetch("/logout", {
      method: "POST",
    });
  },
};

export default authService;
