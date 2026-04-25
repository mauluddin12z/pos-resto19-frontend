"use client";
import React, { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";
import { logout } from "../api/auth";

interface Session {
  userId: number;
  role: string;
}

// Define the context type
interface AuthContextType {
  user: Session | null;
  isLoading: boolean;
  mutate: () => void;
  handleLogout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fetcher function for SWR
const fetchSession = async (): Promise<Session | null> => {
  const { data } = await axiosInstance.get("/auth/session");
  return data?.user || null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Skip fetching if on login page
  const shouldFetch = pathname !== "/login";

  const {
    data: user,
    isLoading,
    mutate,
  } = useSWR<Session | null>(
    shouldFetch ? "/auth/session" : null,
    fetchSession,
  );

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      await mutate(null, false);
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      user: user ?? null,
      isLoading,
      mutate,
      handleLogout,
    }),
    [user, isLoading, mutate, handleLogout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
