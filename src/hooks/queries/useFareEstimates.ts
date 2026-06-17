import { useMutation } from "@tanstack/react-query";
import paymentService from "../../api/services/paymentService";
import { FareEstimatePayload } from "../../types/payment.types";

export const useFareEstimate = () => {
  return useMutation({
    mutationKey: ["fare-estimate"],
    mutationFn: (payload: FareEstimatePayload) =>
      paymentService.getFareEstimate(payload),
    onError: (error: any) => {
      console.error("Fare Estimation Error:", error?.response?.data);
    },
  });
};
