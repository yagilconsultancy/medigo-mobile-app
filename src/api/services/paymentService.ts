import { AxiosResponse } from "axios";
import apiClient from "../client";
import {
  AddPaymentPayload,
  BaseFareEstimateResponse,
  EarningsHistoryResponse,
  EarningsSummaryResponse,
  FareEstimatePayload,
  FareEstimateResponse,
  PaymentIntentPayload,
  PaymentIntentResponse,
  PaymentMethodResponse,
  PaymentMethodsResponse,
  WalletResponse,
  WithdrawalFeeResponse,
  WithdrawalPayload,
  WithdrawalResponse,
} from "../../types/payment.types";

const paymentService = {
  addPaymentMethod: async (
    payload: AddPaymentPayload,
  ): Promise<PaymentMethodResponse> => {
    const response: AxiosResponse<PaymentMethodResponse> = await apiClient.post(
      "/payments/payment-methods/",
      payload,
    );
    return response.data;
  },

  getPaymentMethods: async (): Promise<PaymentMethodsResponse> => {
    const response: AxiosResponse<PaymentMethodsResponse> = await apiClient.get(
      "/payments/payment-methods/",
    );
    return response.data;
  },
  getEarningsBalance: async (): Promise<WalletResponse> => {
    const response = await apiClient.get("/payments/earnings/balance");
    return response.data;
  },

  getEarningsSummary: async (): Promise<EarningsSummaryResponse> => {
    const response = await apiClient.get("/payments/earnings/summary");
    return response.data;
  },

  getEarningsHistory: async (
    days: number = 7,
  ): Promise<EarningsHistoryResponse> => {
    const response = await apiClient.get("/payments/earnings/history", {
      params: { days },
    });
    return response.data;
  },

  getFareEstimate: async (
    payload: FareEstimatePayload,
  ): Promise<FareEstimateResponse> => {
    const response = await apiClient.post(
      "/payments/base-fare-estimate",
      payload,
    );
    return response.data;
  },

  createPaymentIntent: async (
    payload: PaymentIntentPayload,
  ): Promise<PaymentIntentResponse> => {
    const response = await apiClient.post(
      "/payments/mobile/payment-intent",
      payload,
    );
    return response.data;
  },

  getBaseFareEstimate: async (
    payload: FareEstimatePayload,
  ): Promise<BaseFareEstimateResponse> => {
    const response = await apiClient.post("/payments/fare-estimate", payload);
    return response.data;
  },

  requestWithdrawal: async (
    payload: WithdrawalPayload,
  ): Promise<WithdrawalResponse> => {
    const response = await apiClient.post<WithdrawalResponse>(
      "/payments/withdrawals/request",
      payload,
    );
    return response.data;
  },

  getWithdrawalFee: async (amount: number): Promise<WithdrawalFeeResponse> => {
    const response = await apiClient.get<WithdrawalFeeResponse>(
      "/payments/withdrawals/fee",
      {
        params: { amount }, // Injects ?amount=value into the request query parameters
      },
    );
    return response.data;
  },
};

export default paymentService;
