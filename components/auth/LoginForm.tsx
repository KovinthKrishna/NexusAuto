"use client";

import { authApi, handleApiError } from "@/lib/api/authClient";
import { useAuthActions } from "@/lib/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Login form component
 *
 * Features:
 * - Form validation
 * - Loading states
 * - Error handling
 * - Automatic redirect based on user role
 * - Responsive design
 */
export default function LoginForm() {
  const router = useRouter();
  const { login, setLoading } = useAuthActions();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Login API call
      const authResponse = await authApi.login(formData);

      // Store token temporarily
      const token = authResponse.accessToken;

      // Fetch user profile to get role information
      const { userApi } = await import("@/lib/api/authClient");

      // Temporarily set token to make authenticated request
      const tempClient = (await import("@/lib/api/authClient")).apiClient;
      tempClient.defaults.headers.Authorization = `Bearer ${token}`;

      const userProfile = await userApi.getProfile();

      // Store authentication state
      login(token, userProfile);

      // Redirect based on user role
      const roleRedirects = {
        ROLE_ADMIN: "/admin",
        ROLE_EMPLOYEE: "/employee",
        ROLE_CUSTOMER: "/customer",
      };
      
      const redirectPath = roleRedirects[userProfile.role] || "/profile";
      router.push(redirectPath);
    } catch (error) {
      console.error("Login failed:", error);
      setApiError(handleApiError(error));
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {apiError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {apiError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                className={`relative mt-1 block w-full appearance-none border px-3 py-2 ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange("password")}
                className={`relative mt-1 block w-full appearance-none border px-3 py-2 ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
                isSubmitting
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              } transition-colors`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
