import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  login as loginApi,
  logout as logoutApi,
  getCurrentUser,
  verifyToken,
  type LoginParams,
  type RegisterParams,
} from "@/services/auth";
import { tokenManager } from "@/lib/fetch";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (params: LoginParams) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
  /** 向 Redis 验证 token 是否有效 */
  validateToken: () => Promise<boolean>;
  /** 拉取用户信息 */
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (params) => {
        set({ isLoading: true, error: null });
        try {
          const res = await loginApi(params);
          const token = res.data?.token?.replace(/^Bearer\s+/, "") ?? "";
          const refreshToken =
            res.data?.refreshToken?.replace(/^Bearer\s+/, "") ?? "";
          tokenManager.setToken(token, params.remember);
          if (refreshToken)
            tokenManager.setRefreshToken(refreshToken, params.remember);
          if (res.data?.user) {
            set({
              user: res.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "登录失败";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      register: async (params) => {
        set({ isLoading: true, error: null });
        try {
          const { register: registerApi } = await import("@/services/auth");
          const res = await registerApi(params);
          const token = res.data?.token?.replace(/^Bearer\s+/, "") ?? "";
          tokenManager.setToken(token);
          if (res.data?.user) {
            set({
              user: res.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "注册失败";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await logoutApi();
        } finally {
          tokenManager.clearToken();
          set({ user: null, isAuthenticated: false });
        }
      },

      validateToken: async () => {
        try {
          const res = await verifyToken();
          return res.data === true;
        } catch {
          return false;
        }
      },

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const res = await getCurrentUser();
          set({
            user: res.data as User,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          tokenManager.clearToken();
          set({ user: null, isAuthenticated: false, isLoading: false });
          throw new Error("token 已失效");
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
