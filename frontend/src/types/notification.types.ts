export type NotificationId = string;

export type NotificationType =
  "INFO" | "SUCCESS" | "WARNING" | "ERROR" | (string & {});

export interface Notification {
  id: NotificationId;
  userId?: string;
  title: string;
  message: string;
  type?: NotificationType;
  read?: boolean;
  createdAt?: string;
}

export interface NotificationPreferences {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  smsEnabled?: boolean;
}

export interface MarkNotificationReadRequest {
  read: boolean;
}
