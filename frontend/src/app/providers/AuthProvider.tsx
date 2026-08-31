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

const IS_DEV_MODE = import.meta.env.DEV || import.meta.env.VITE_DISABLE_AUTH === "true";

const DEV_DEFAULT_USER: User = {
  id: "000000000000000000000001",
  username: "developer",
  email: "dev@ideaforge.local",
  role: "admin",
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => (IS_DEV_MODE ? DEV_DEFAULT_USER : null));
  const [accessToken, setAccessToken] = useState<string | null>(() => (IS_DEV_MODE ? "dev-access-token" : null));
  const [isLoading, setIsLoading] = useState(!IS_DEV_MODE);

  // Keep the apiClient token in sync with context state
  useEffect(() => {
    syncApiToken(accessToken);
  }, [accessToken]);

  // On mount, attempt to refresh/sync the user session from the backend.
  // In development mode, falls back to the developer user if backend session is absent.
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
        if (!cancelled && IS_DEV_MODE) {
          setUser(DEV_DEFAULT_USER);
          setAccessToken("dev-access-token");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    try {
      const res = await authServiceApi.login({ identifier, password });
      setUser(res.data.user);
      setAccessToken(res.data.accessToken);
    } catch (err) {
      if (IS_DEV_MODE) {
        setUser(DEV_DEFAULT_USER);
        setAccessToken("dev-access-token");
      } else {
        throw err;
      }
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        const res = await authServiceApi.register({ username, email, password });
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
      } catch (err) {
        if (IS_DEV_MODE) {
          setUser({ ...DEV_DEFAULT_USER, username, email });
          setAccessToken("dev-access-token");
        } else {
          throw err;
        }
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authServiceApi.logout();
    } catch {
      // Ignore network errors on logout
    }
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
