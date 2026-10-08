import { AxiosResponse } from "axios";
import apiClient from "../client";
import { AUTH_ENDPOINTS } from "../endpoints";
import {
  RequestOTPPayload,
  VerifyOTPPayload,
  AuthResponse,
  ResendOTPPayload,
  OTPResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyOTPResponse,
  ResendOtpParams,
  ResendOtpResponse,
  RegisterDriverPayload,
  RegisterDriverResponse,
  VerifyDriverInvitePayload,
  VerifyDriverInviteResponse,
} from "../../types/auth.types";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../../types/user.types";

export type DriverActivationStep = "not_activated" | "set_password" | "login";

export interface DriverActivationCheckResponse {
  success: boolean;
  message?: string | null;
  data?: {
    next_step: DriverActivationStep;
    message?: string | null;
  } | null;
}

// These calls happen before the driver has an account session, so they skip
// auth and handle their own error messages on the screen.
const PRE_LOGIN_REQUEST = {
  skipAuth: true,
  suppressGlobalErrorToast: true,
} as any;

// Interface for type safety
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

const authService = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response: AxiosResponse<RegisterResponse> = await apiClient.post(
      AUTH_ENDPOINTS.REGISTER,
      payload,
    );
    return response.data;
  },

  login: async (payload: any): Promise<any> => {
    const response: AxiosResponse<any> = await apiClient.post(
      AUTH_ENDPOINTS.LOGIN,
      payload,
    );
    return response.data;
  },

  verifyRegistrationOTP: async (payload: any): Promise<VerifyOTPResponse> => {
    const response: AxiosResponse<VerifyOTPResponse> = await apiClient.post(
      AUTH_ENDPOINTS.VERIFY_OTP,
      payload,
    );
    return response.data;
  },

  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> => {
    const response: AxiosResponse<ForgotPasswordResponse> =
      await apiClient.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    const response: AxiosResponse<ResetPasswordResponse> =
      await apiClient.post("/auth/reset-password", data);
    return response.data;
  },

  resendOtp: async ({
    user_id,
    purpose = "registration",
  }: ResendOtpParams): Promise<ResendOtpResponse> => {
    const response: AxiosResponse<ResendOtpResponse> = await apiClient.post(
      "/auth/resend-otp",
      null, // No request body
      {
        params: {
          user_id,
          purpose,
        },
      },
    );
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await apiClient.post("/auth/change-password", payload);
    return response.data;
  },

  registerDriver: async (
    payload: RegisterDriverPayload,
  ): Promise<RegisterDriverResponse> => {
    const response = await apiClient.post("/auth/driver/register", payload, {
      skipAuth: true,
      suppressGlobalErrorToast: true,
    } as any);
    return response.data;
  },

  checkDriverActivation: async (
    email: string,
  ): Promise<DriverActivationCheckResponse> => {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.DRIVER_ACTIVATION_CHECK,
      { email },
      PRE_LOGIN_REQUEST,
    );
    return response.data;
  },

  requestDriverActivationCode: async (email: string) => {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.DRIVER_ACTIVATION_REQUEST_CODE,
      { email },
      PRE_LOGIN_REQUEST,
    );
    return response.data;
  },

  completeDriverActivation: async (payload: {
    email: string;
    otp: string;
    password: string;
  }) => {
    const response = await apiClient.post(
      AUTH_ENDPOINTS.DRIVER_ACTIVATION_COMPLETE,
      payload,
      PRE_LOGIN_REQUEST,
    );
    return response.data;
  },

  verifyDriverInvite: async (
    payload: VerifyDriverInvitePayload,
  ): Promise<VerifyDriverInviteResponse> => {
    const response = await apiClient.post("/auth/driver/verify-invite", payload, {
      skipAuth: true,
      suppressGlobalErrorToast: true,
    } as any);
    return response.data;
  },
};

export default authService;
