import { useQuery } from "@tanstack/react-query";

import { userService } from "@/services/user.service";
import type { UserId } from "@/types/user.types";

export const currentUserQueryKey = (userId?: UserId) =>
  ["user", "current", userId] as const;

export function useCurrentUser(userId?: UserId) {
  const query = useQuery({
    queryKey: currentUserQueryKey(userId),

    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      return userService.getById(userId);
    },

    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
