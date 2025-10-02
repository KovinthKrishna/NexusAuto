interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
}

interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "ROLE_CUSTOMER" | "ROLE_EMPLOYEE" | "ROLE_ADMIN";
  enabled: boolean;
}

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
