import { useQuery } from "@tanstack/react-query";
import paymentService from "../../api/services/paymentService";

export const useGetWithdrawalFee = (amount: string) => {
  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;

  return useQuery({
    queryKey: ["withdrawalFee", parsedAmount],
    queryFn: () => paymentService.getWithdrawalFee(parsedAmount),
    enabled: isValidAmount, // Only fires API call if user has typed a valid number
    staleTime: 1000 * 60 * 5, // Keep fee calculation cached for 5 minutes if value doesn't change
  });
};
