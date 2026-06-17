import { useQuery } from "@tanstack/react-query";
import notificationService from "../../api/services/notificationService";

export const useChatConversations = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["chats", page, limit],
    queryFn: () => notificationService.getConversations(page, limit),
    // Polling: Optionally refetch every 30 seconds to catch new messages
    // refetchInterval: 30000,
    staleTime: 1000 * 10, // Consider data fresh for 10 seconds
  });
};
