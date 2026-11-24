import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  AuthSession,
} from "@/types/auth.types";

const AUTH_SESSION_KEY = ["auth", "session"] as const;

export function useAuth() {
  const queryClient = useQueryClient();

  const session = queryClient.getQueryData<AuthSession>(AUTH_SESSION_KEY);

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest): Promise<LoginResponse> =>
      authService.login(data),

    onSuccess: (response) => {
      if (response.user) {
        const user = response.user;

        queryClient.setQueryData<AuthSession>(AUTH_SESSION_KEY, {
          userId: user.id,
          globalUserId: user.globalUserId,
          email: user.email ?? "",
          roles: user.roles ?? [],
          isAuthenticated: true,
        });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest): Promise<RegisterResponse> =>
      authService.register(data),
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_SESSION_KEY });
      queryClient.removeQueries({ queryKey: ["user", "current"] });
    },
  });

  return {
    session,
    user: session
      ? {
          userId: session.userId,
          globalUserId: session.globalUserId,
          email: session.email,
          roles: session.roles,
        }
      : null,

    isAuthenticated: session?.isAuthenticated ?? false,

    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
