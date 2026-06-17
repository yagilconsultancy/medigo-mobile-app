import { AxiosResponse } from "axios";
import apiClient from "../client";
import {
  ChatListResponse,
  GetNotificationsParams,
  NotificationsResponse,
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
