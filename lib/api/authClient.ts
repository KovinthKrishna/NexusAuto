import { useAuthStore } from "@/lib/store/authStore";
import axios from "axios";

const API_BASE_URL =
  process.env.AUTH_SERVICE_API_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to automatically add authorization header
 apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for global error handling and token management
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { logout } = useAuthStore.getState();

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      logout();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// Authentication API methods
export const authApi = {
  // Register a new user
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/register",
      data,
    );
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/login",
      data,
    );
    return response.data;
  },
};

// User API methods
export const userApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get<UserResponse>("/api/v1/users/me");
    return response.data;
  },

  // Update current user profile
  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.put<UserResponse>(
      "/api/v1/users/me",
      data,
    );
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest) => {
    await apiClient.patch("/api/v1/users/me/password", data);
  },
};

// Admin API methods
export const adminApi = {
  // Get all employees
  getEmployees: async () => {
    const response = await apiClient.get<UserResponse[]>("/api/v1/employees");
    return response.data;
  },

  // Create new employee
  createEmployee: async (data: RegisterRequest) => {
    await apiClient.post("/api/v1/employees", data);
  },

  // Toggle employee status
  toggleEmployeeStatus: async (id: number) => {
    await apiClient.patch(`/api/v1/employees/${id}/status`);
  },
};

// Utility function to handle API errors consistently
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data || error.message;
  }
  return "An unexpected error occurred. Please try again.";
};
