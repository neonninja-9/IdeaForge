/**
 * Auth Types
 * ----------
 * Shared TypeScript interfaces for the auth system.
 * Used across services, context, hooks, and pages.
 */

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface AuthResponse {
  status: "success";
  data: {
    user: User;
    accessToken: string;
  };
}

export interface RefreshResponse {
  status: "success";
  data: {
    user: User;
    accessToken: string;
  };
}

export interface AuthErrorResponse {
  status: "fail" | "error";
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}
