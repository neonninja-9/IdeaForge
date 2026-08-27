/**
 * useAuth Hook
 * ------------
 * Convenience hook that consumes AuthContext.
 * Throws if used outside of an AuthProvider to catch
 * integration mistakes early.
 */

import { useContext } from "react";
import { AuthContext } from "../app/providers/AuthProvider";
import type { AuthContextValue } from "../app/providers/AuthProvider";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}
