import api from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
} from "@/types/auth.types";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  refresh: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>(
      "/auth/refresh",
      data,
    );
    return response.data;
  },

  logout: async (data?: LogoutRequest): Promise<void> => {
    await api.post("/auth/logout", data);
  },
};
