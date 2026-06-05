"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUser, logout } from "@/service/auth";
import { useRouter } from "next/navigation";
import type { MeResult } from "@/type";

type AuthContextType = {
  user: MeResult | null;
  loading: boolean;
  isAuthenticated: boolean;
  logoutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeResult | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getUser();

      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logoutUser = async () => {
    try {
      await logout();

      setUser(null);

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logoutUser,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
