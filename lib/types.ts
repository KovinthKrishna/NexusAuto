/**
 * Data Transfer Objects (DTOs) for API communication
 * These interfaces must match the backend API contract exactly
 */

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "ROLE_CUSTOMER" | "ROLE_EMPLOYEE" | "ROLE_ADMIN";
  enabled: boolean;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Additional types for frontend use
export type UserRole = "ROLE_CUSTOMER" | "ROLE_EMPLOYEE" | "ROLE_ADMIN";

export interface AuthState {
  token: string | null;
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
