import { useMutation, useQueryClient } from "@tanstack/react-query";
import notificationService from "../../api/services/notificationService";
import { UNREAD_NOTIFICATIONS_KEY } from "../queries/useUnreadNotificationCount";

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: UNREAD_NOTIFICATIONS_KEY });
    },
    // Read state is a nicety; never bother the user if it fails.
    meta: { silent: true },
  });
};
