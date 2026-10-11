import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/client";

// Same key and endpoint the receipt screen uses, so both share one cache entry.
export const usePaymentReceipt = (rideId?: string) => {
  return useQuery({
    queryKey: ["payment-receipt", rideId],
    queryFn: async () =>
      (await apiClient.get(`/payments/receipts/${rideId}`)).data,
    enabled: !!rideId,
    retry: false,
  });
};
