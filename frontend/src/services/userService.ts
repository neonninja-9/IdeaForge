import { apiFetch } from "./apiClient";
import type { User } from "../types/auth.types";

export type Preferences = { productUpdates: boolean; weeklyReflection: boolean };

const userService = {
  updateProfile: (data: Partial<Pick<User, "username" | "email">>) =>
    apiFetch<{ status: "success"; data: { user: User } }>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  getPreferences: () =>
    apiFetch<{ status: "success"; data: { preferences: Preferences } }>("/users/me/preferences"),
  updatePreferences: (preferences: Preferences) =>
    apiFetch<{ status: "success"; data: { preferences: Preferences } }>("/users/me/preferences", {
      method: "PUT",
      body: JSON.stringify({ preferences }),
    }),
};

export default userService;
