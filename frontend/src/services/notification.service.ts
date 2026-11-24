import api from "@/lib/axios";
import type {
  Notification,
  NotificationId,
  NotificationPreferences,
  MarkNotificationReadRequest,
} from "@/types/notification.types";

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>("/notifications");
    return response.data;
  },

  getUnread: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>("/notifications/unread");
    return response.data;
  },

  markAsRead: async (
    id: NotificationId,
    data: MarkNotificationReadRequest = { read: true },
  ): Promise<void> => {
    await api.patch(`/notifications/${id}/read`, data);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },

  delete: async (id: NotificationId): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await api.get<NotificationPreferences>(
      "/notifications/preferences",
    );
    return response.data;
  },

  updatePreferences: async (
    data: NotificationPreferences,
  ): Promise<NotificationPreferences> => {
    const response = await api.put<NotificationPreferences>(
      "/notifications/preferences",
      data,
    );
    return response.data;
  },
};
