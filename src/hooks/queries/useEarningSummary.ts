import { useQuery } from "@tanstack/react-query";
import paymentService from "../../api/services/paymentService";

export const useEarningsSummary = () => {
  return useQuery({
    queryKey: ["earnings-summary"],
    queryFn: paymentService.getEarningsSummary,
    // Refetch when the app comes back to the foreground (standard for dashboards)
    refetchOnWindowFocus: true,
    // Keep the "Today" data fresh
    staleTime: 1000 * 60, // 1 minute
  });
};
