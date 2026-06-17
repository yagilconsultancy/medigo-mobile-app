import { useQuery } from "@tanstack/react-query";
import paymentService from "../../api/services/paymentService";

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentService.getPaymentMethods(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
