"use client";

import { userApi } from "@/lib/api/client";
import { useAuth, useAuthActions, useAuthRole } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  fallback?: React.ReactNode;
}

/**
 * Higher-Order Component for protecting routes
 *
 * Features:
 * - Redirects unauthenticated users to login
 * - Checks role-based permissions
 * - Shows loading state during authentication check
 * - Validates token by fetching user profile
 */
export function ProtectedRoute({
  children,
  requiredRole = [],
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuth();
  const { login, logout, setLoading } = useAuthActions();
  const { hasRole } = useAuthRole();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      // If no token, redirect to login
      if (!token) {
        router.push("/login");
        setLoading(false);
        return;
      }

      // If we have a token but no user data, fetch user profile
      if (token && !user) {
        try {
          const userData = await userApi.getProfile();
          login(token, userData);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          logout();
          router.push("/login");
          setLoading(false);
          return;
        }
      }

      setIsInitialized(true);
      setLoading(false);
    };

    initializeAuth();
  }, [token, user, login, logout, setLoading, router]);

  // Show loading state
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    return null; // Router will handle redirect
  }

  // Check role-based permissions
  if (requiredRole.length > 0 && !requiredRole.some((role) => hasRole(role))) {
    return (
      fallback || (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-red-600">403</h1>
            <h2 className="mb-4 text-2xl font-semibold">Access Forbidden</h2>
            <p className="mb-6 text-gray-600">
              You don&apos;t have permission to access this page.
            </p>
            <button
              onClick={() => router.back()}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

/**
 * Hook for programmatic route protection
 * Useful for protecting specific actions within components
 */
export function useRouteProtection() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { hasRole } = useAuthRole();

  const requireAuth = (redirectPath = "/login") => {
    if (!isAuthenticated) {
      router.push(redirectPath);
      return false;
    }
    return true;
  };

  const requireRole = (roles: string[], redirectPath = "/") => {
    if (!isAuthenticated || !user) {
      router.push("/login");
      return false;
    }

    if (!roles.some((role) => hasRole(role))) {
      router.push(redirectPath);
      return false;
    }

    return true;
  };

  return {
    requireAuth,
    requireRole,
    isAuthenticated,
    user,
  };
}

/**
 * Component wrapper for admin-only content
 */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={["ROLE_ADMIN"]}>{children}</ProtectedRoute>
  );
}

/**
 * Component wrapper for employee and admin content
 */
export function EmployeeOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={["ROLE_EMPLOYEE", "ROLE_ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Component wrapper for authenticated users only
 */
export function AuthenticatedOnly({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
