import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthStore extends AuthState {
  // Actions
  setToken: (token: string) => void;
  setUser: (user: UserResponse) => void;
  login: (token: string, user: UserResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (userData: Partial<UserResponse>) => void;

  // Helper methods
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isEmployee: () => boolean;
  isCustomer: () => boolean;
}

/**
 * Zustand store for authentication state management
 *
 * - Persists authentication state to localStorage
 * - Provides helper methods for role checking
 * - Manages loading states for UI feedback
 * - Handles user profile updates
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      setToken: (token: string) => set({ token, isAuthenticated: !!token }),

      setUser: (user: UserResponse) => set({ user }),

      login: (token: string, user: UserResponse) =>
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      updateUser: (userData: Partial<UserResponse>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // Helper methods
      hasRole: (role: string) => {
        const { user } = get();
        return user?.role === role;
      },
      
      isAdmin: () => get().hasRole("ROLE_ADMIN"),
      isEmployee: () => get().hasRole("ROLE_EMPLOYEE"),
      isCustomer: () => get().hasRole("ROLE_CUSTOMER"),
    }),
    {
      name: "auth-storage",
      // Only persist essential data
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Hook to get authentication status and user info
export const useAuth = () => {
  const { token, user, isAuthenticated, isLoading } = useAuthStore();
  return { token, user, isAuthenticated, isLoading };
};

// Hook to get authentication actions
export const useAuthActions = () => {
  const { setToken, setUser, login, logout, setLoading, updateUser } =
    useAuthStore();
  return { setToken, setUser, login, logout, setLoading, updateUser };
};

// Hook to get role checking utilities
export const useAuthRole = () => {
  const { hasRole, isAdmin, isEmployee, isCustomer } = useAuthStore();
  return { hasRole, isAdmin, isEmployee, isCustomer };
};
