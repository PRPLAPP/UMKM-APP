import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  fetchCurrentUser,
  login as loginRequest,
  registerAccount,
  type AuthResponse,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/api";

type AuthUser = AuthResponse["user"];

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  initializing: boolean;
  authLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
}

const STORAGE_KEY = "umkm-auth-token";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      if (!token) {
        setUser(null);
        setInitializing(false);
        return;
      }

      try {
        const current = await fetchCurrentUser(token);
        if (isMounted) {
          setUser(current);
        }
      } catch (error) {
        console.error("Failed to fetch current user", error);
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const persistSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, nextToken);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setAuthLoading(true);
      try {
        const { token: nextToken, user: nextUser } = await loginRequest(payload);
        persistSession(nextToken, nextUser);
        return nextUser;
      } finally {
        setAuthLoading(false);
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setAuthLoading(true);
      try {
        const { token: nextToken, user: nextUser } = await registerAccount(payload);
        persistSession(nextToken, nextUser);
        return nextUser;
      } finally {
        setAuthLoading(false);
      }
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      initializing,
      authLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [authLoading, initializing, login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
