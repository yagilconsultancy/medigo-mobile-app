import { useQuery } from "@tanstack/react-query";
import paymentService from "../../api/services/paymentService";

export const useEarningsHistory = (days: number = 7) => {
  return useQuery({
    queryKey: ["earnings-history", days],
    queryFn: () => paymentService.getEarningsHistory(days),
    // Keeps the previous data visible while fetching new data for a smoother UI
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
