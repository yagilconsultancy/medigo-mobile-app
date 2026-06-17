import { useMutation } from "@tanstack/react-query";
import { FareEstimatePayload } from "../../types/payment.types";
import { Alert } from "react-native";
import paymentService from "../../api/services/paymentService";

export const useGetFareEstimateMutation = () => {
  return useMutation({
    mutationKey: ["fare-estimate"],
    mutationFn: (payload: FareEstimatePayload) =>
      paymentService.getBaseFareEstimate(payload),
    onError: (error: any) => {
      console.error("Fare Estimation Error:", error?.response?.data);
    },
  });
};
