import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SessionUser, AuthResponse, AuthTokens } from "@/lib/types";
import { saveTokens, clearTokens } from "@/lib/api";

interface AuthState {
  user: SessionUser | null;
  isAuthenticated: boolean;
  login: (response: AuthResponse) => void;
  updateUser: (user: Partial<SessionUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (response: AuthResponse) => {
        saveTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
        set({
          user: {
            id: response.user.id,
            username: response.user.username,
            displayName: response.user.displayName,
            avatarUrl: null,
          },
          isAuthenticated: true,
        });
      },

      updateUser: (partial: Partial<SessionUser>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        }));
      },

      logout: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "humix-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
