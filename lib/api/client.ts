import { useAuthStore } from "@/lib/store/auth";
import {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  UserResponse,
} from "@/lib/types";
import axios from "axios";

/**
 * Base API configuration
 * Update this URL to match your Spring Boot backend
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Axios instance with automatic token management
 *
 * Features:
 * - Automatically adds Authorization header for authenticated requests
 * - Handles token refresh logic (if implemented in backend)
 * - Centralizes error handling
 * - Provides consistent request/response transformation
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Request interceptor to automatically add authorization header
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get current token from Zustand store
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor for global error handling and token management
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { logout } = useAuthStore.getState();

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear authentication state and redirect to login
      logout();

      // Only redirect if we're in the browser (not during SSR)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.error("Access forbidden: Insufficient permissions");
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error: Please check your internet connection");
    }

    return Promise.reject(error);
  },
);

/**
 * Authentication API methods
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/register",
      data,
    );
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/login",
      data,
    );
    return response.data;
  },
};

/**
 * User API methods (requires authentication)
 */
export const userApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>("/api/v1/users/me");
    return response.data;
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>(
      "/api/v1/users/me",
      data,
    );
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.patch("/api/v1/users/me/password", data);
  },
};

/**
 * Admin API methods (admin role required)
 */
export const adminApi = {
  /**
   * Get all employees
   */
  getEmployees: async (): Promise<UserResponse[]> => {
    const response = await apiClient.get<UserResponse[]>("/api/v1/employees");
    return response.data;
  },

  /**
   * Create new employee
   */
  createEmployee: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post("/api/v1/employees", data);
  },

  /**
   * Toggle employee status
   */
  toggleEmployeeStatus: async (id: number): Promise<void> => {
    await apiClient.patch(`/api/v1/employees/${id}/status`);
  },
};

/**
 * Utility function to handle API errors consistently
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data || error.message;
  }
  return "An unexpected error occurred. Please try again.";
};
