import { useEffect } from "react";
import { useRouter } from "next/router";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Get the current user's token
export const getToken = (): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem("token");
};

// Get the current user's type (admin or client)
export const getUserType = (): "admin" | "client" | null => {
  if (!isBrowser) return null;
  const type = localStorage.getItem("userType");
  return type === "admin" || type === "client"
    ? (type as "admin" | "client")
    : null;
};

// Get client user data
export const getClientUserData = (): any => {
  if (!isBrowser) return null;
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

// Check if the user is logged in
export const isLoggedIn = (): boolean => {
  if (!isBrowser) return false;
  return !!getToken();
};

// Logout the user
export const logout = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem("token");
  localStorage.removeItem("userType");
  localStorage.removeItem("userData");

  // Make a call to the logout endpoint (optional)
  fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch(console.error);
};

// Get authorization header
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Hook to protect client routes
export function useClientAuth() {
  const router = useRouter();

  useEffect(() => {
    const userType = getUserType();
    const token = getToken();

    if (!token || userType !== "client") {
      router.push("/client/login");
    }
  }, [router]);

  return {
    isLoggedIn: isLoggedIn(),
    userData: getClientUserData(),
  };
}

// Hook to protect admin routes
export function useAdminAuth() {
  const router = useRouter();

  useEffect(() => {
    const userType = getUserType();
    const token = getToken();

    if (!token || userType !== "admin") {
      router.push("/admin/login");
    }
  }, [router]);

  return {
    isLoggedIn: isLoggedIn(),
  };
}
