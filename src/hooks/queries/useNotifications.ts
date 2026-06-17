import { useQuery } from "@tanstack/react-query";
import { GetNotificationsParams } from "../../types/notifications.types";
import notificationService from "../../api/services/notificationService";

export const useNotifications = (
  params: GetNotificationsParams = { page: 1, limit: 20 },
) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationService.getNotifications(params),
    // Keeps the old data visible while fetching the new page
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 minute
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 503) return false;

      return failureCount < 2;
    },
  });
};
