import { useMutation } from "@tanstack/react-query";
import authService, {
  ChangePasswordPayload,
} from "../../api/services/authService";
import {
  RegisterDriverPayload,
  RegisterDriverResponse,
  RegisterPayload,
  ResendOtpParams,
  VerifyDriverInvitePayload,
  VerifyDriverInviteResponse,
  VerifyOTPPayload,
} from "../../types/auth.types";
import { Alert } from "react-native";
import { storage } from "../../utils/storage";
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../../types/user.types";
import Toast from "react-native-toast-message";

const getErrorMessage = (error: any, fallback: string) => {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail[0]?.msg || fallback;
  }

  if (typeof detail === "string") {
    return detail;
  }

  return error?.response?.data?.message || fallback;
};

const showErrorToast = (title: string, message: string) => {
  Toast.show({
    type: "errorToast",
    text1: title,
    text2: message,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      // Handle success (e.g., redirect to OTP verification or show toast)
      console.log("Registration successful:", data.message);
    },
    onError: (error: any) => {
      // Handle error (e.g., show validation errors from the 422 response)
      console.error(
        "Registration failed:",
        error.response?.data?.detail || error.message,
      );
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: any) => authService.login(payload),
    onSuccess: async (data) => {
      // Handle success (e.g., redirect to OTP verification or show toast)
      console.log("Registration successful:", data.message);
      console.log("OTP Verified:", data);
      if (data.data.access_token) {
        await storage.setToken(data.data.access_token);
      }
      if (data.data.refresh_token) {
        await storage.setRefreshToken(data.data.refresh_token);
      }
      if (data.data.user_id) {
        await storage.setUser(data.data.user_id);
      }
    },
    onError: (error: any) => {
      // Handle error (e.g., show validation errors from the 422 response)
      console.error(
        "Registration failed:",
        error.response?.data?.detail || error.message,
      );
    },
  });
};

export const useVerifyOTPMutation = () => {
  return useMutation({
    mutationFn: (payload: VerifyOTPPayload) =>
      authService.verifyRegistrationOTP(payload),
    onSuccess: async (data) => {
      // Logic for when verification is successful
      console.log("OTP Verified:", data);
    },
    onError: (error: any) => {
      // Logic for 422 Validation errors or invalid codes
      const errorMsg = error.response?.data?.detail?.[0]?.msg || "Invalid OTP";
      console.error("Verification Error:", errorMsg);
      Alert.alert("Verification Error:", errorMsg);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),

    onError: (error: any) => {
      const errorMessage = getErrorMessage(
        error,
        "Something went wrong. Please try again.",
      );
      showErrorToast("Error", errorMessage);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),

    onSuccess: (response) => {
      Alert.alert(
        "Password reset",
        response.message || "Your password has been reset successfully.",
      );
    },

    onError: (error: any) => {
      const errorMessage = getErrorMessage(
        error,
        "Failed to reset password. Please check the code and try again.",
      );
      showErrorToast("Error", errorMessage);
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (params: ResendOtpParams) => authService.resendOtp(params),

    onSuccess: (response) => {
      Alert.alert("Success", response.message || "OTP resent successfully.");
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail?.[0]?.msg ||
        "Failed to resend OTP. Please try again later.";
      Alert.alert("Error", errorMessage);
    },
  });
};

export const useRegisterDriver = () => {
  return useMutation<RegisterDriverResponse, any, RegisterDriverPayload>({
    mutationFn: authService.registerDriver,
    onSuccess: (data) => {
      console.log("🎉 Driver registered successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Driver registration failed:", error);

      const errorMessage =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.message ||
        "Registration failed. Please check your invite token and try again.";
    },
  });
};

export const useVerifyDriverInvite = () => {
  return useMutation<
    VerifyDriverInviteResponse,
    any,
    VerifyDriverInvitePayload
  >({
    mutationFn: authService.verifyDriverInvite,
    onSuccess: (data) => {
      console.log("✅ Driver invite verified:", data);
    },
    onError: (error) => {
      console.error("❌ Driver invite verification failed:", error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      authService.changePassword(payload),
    onSuccess: (response) => {
      // API returns: { "success": true, "message": "string", "data": "string" }
      Alert.alert(
        "Success",
        response.message || "Password changed successfully",
      );
    },
    onError: (error: any) => {
      // Handle 422 Validation Errors or standard errors
      const errorMessage =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.message ||
        "Failed to change password. Please check your current password.";

      Alert.alert("Error", errorMessage);
    },
  });
};
