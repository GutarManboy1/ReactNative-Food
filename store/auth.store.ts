import { getCurrentUser } from "@/lib/appwrite";
import { User } from "@sentry/react-native";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),

  fetchAuthenticatedUser: async () => {
    // Implementation for fetching authenticated user
    set({ isLoading: true });
    try {
      // Simulate fetching user data
      const user = await getCurrentUser();
      if (user) {
        set({ user, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
export default useAuthStore;