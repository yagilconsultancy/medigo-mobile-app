import { AxiosResponse } from "axios";
import apiClient from "../client";
import {
  ChatListResponse,
  GetNotificationsParams,
  NotificationsResponse,
  UnreadCountResponse,
} from "../../types/notifications.types";

const notificationService = {
  getNotifications: async (
    params: GetNotificationsParams,
  ): Promise<NotificationsResponse> => {
    const response: AxiosResponse<NotificationsResponse> = await apiClient.get(
      "/notifications/inbox",
      { params },
    );
    return response.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response: AxiosResponse<UnreadCountResponse> = await apiClient.get(
      "/notifications/inbox/unread-count",
    );
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.put(`/notifications/inbox/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put("/notifications/inbox/read-all");
  },

  getConversations: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<ChatListResponse> => {
    const response = await apiClient.get("/notifications/chats", {
      params: { page, limit },
    });
    return response.data;
  },
};

export default notificationService;
