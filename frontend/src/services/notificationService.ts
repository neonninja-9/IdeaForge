import { apiFetch } from "./apiClient";
import type { NotificationsResponse, NotificationItem } from "../types/idea.types";

const notificationService = {
  getNotifications: () =>
    apiFetch<NotificationsResponse>("/notifications", { method: "GET" }),

  markAsRead: (id: string) =>
    apiFetch<{ status: string; data: { notification: NotificationItem } }>(
      `/notifications/${id}/read`,
      { method: "PATCH" }
    ),

  markAllAsRead: () =>
    apiFetch<{ status: string; message: string }>("/notifications/read-all", {
      method: "PATCH",
    }),
};

export default notificationService;
