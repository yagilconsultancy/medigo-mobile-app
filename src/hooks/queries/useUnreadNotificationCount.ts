import { useQuery } from "@tanstack/react-query";
import notificationService from "../../api/services/notificationService";

export const UNREAD_NOTIFICATIONS_KEY = ["notifications-unread-count"];

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: UNREAD_NOTIFICATIONS_KEY,
    queryFn: () => notificationService.getUnreadCount(),
    select: (response) => response?.data?.unread_count ?? 0,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    retry: false,
  });
};
