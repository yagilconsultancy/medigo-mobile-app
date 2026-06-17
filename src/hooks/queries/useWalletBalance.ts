import { useQuery } from "@tanstack/react-query";
import paymentService from "../../api/services/paymentService";

export const useWalletBalance = () => {
  return useQuery({
    queryKey: ["wallet-balance"],
    queryFn: paymentService.getEarningsBalance,
    // Optional: Refresh every 5 minutes while the app is open
    refetchInterval: 1000 * 60 * 5,
    // Prevents the UI from flashing "loading" if we already have cached data
    placeholderData: (previousData) => previousData,
  });
};
