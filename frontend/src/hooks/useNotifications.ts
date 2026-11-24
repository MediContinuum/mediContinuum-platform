import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "@/services/notification.service";
import type { NotificationId } from "@/types/notification.types";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationQueryKeys.all, "list"] as const,
  unread: () => [...notificationQueryKeys.all, "unread"] as const,
};

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: notificationService.getAll,
    staleTime: 60 * 1000,
  });

  const unreadQuery = useQuery({
    queryKey: notificationQueryKeys.unread(),
    queryFn: notificationService.getUnread,
    staleTime: 60 * 1000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: NotificationId) => notificationService.markAsRead(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: NotificationId) => notificationService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
    },
  });

  const notifications = notificationsQuery.data ?? [];
  const unreadNotifications = unreadQuery.data ?? [];

  return {
    notifications,
    unreadNotifications,
    unreadCount: unreadNotifications.length,

    isLoading: notificationsQuery.isLoading,
    isFetching: notificationsQuery.isFetching,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,

    markAsRead: markAsReadMutation.mutate,
    markAsReadAsync: markAsReadMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,

    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,

    deleteNotification: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,

    refetch: notificationsQuery.refetch,
  };
}
