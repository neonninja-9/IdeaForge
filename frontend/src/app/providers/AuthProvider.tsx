/**
 * Auth Context
 * ------------
 * Global auth state via React Context.
 * Stores the current user and access token in memory.
 * Syncs the access token with the shared apiClient so all
 * service modules can make authenticated requests.
 *
 * Provides: login, register, logout, and a loading state
 * for initial token refresh on app mount.
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import authServiceApi from "../../services/authService";
import { setAccessToken as syncApiToken } from "../../services/apiClient";
import type { User } from "../../types/auth.types";

export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Keep the apiClient token in sync with context state
  useEffect(() => {
    syncApiToken(accessToken);
  }, [accessToken]);

  // On mount, attempt to refresh the access token from the httpOnly cookie.
  // If the cookie is valid, we silently restore the session.
  useEffect(() => {
    let cancelled = false;

    authServiceApi
      .refresh()
      .then((res) => {
        if (!cancelled) {
          setUser(res.data.user);
          setAccessToken(res.data.accessToken);
        }
      })
      .catch(() => {
        // No valid refresh token — user is not logged in (expected on first visit)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await authServiceApi.login({ identifier, password });
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const res = await authServiceApi.register({ username, email, password });
      setUser(res.data.user);
      setAccessToken(res.data.accessToken);
    },
    []
  );

  const logout = useCallback(async () => {
    await authServiceApi.logout();
    setUser(null);
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
