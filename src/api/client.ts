import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_CONFIG } from "../utils/constants";
import { storage } from "../utils/storage";
import { ErrorResponse } from "../types/auth.types";
import { useUserStore } from "../store/userStore";
import { navigateAndReset } from "../utils/navigationRef";
import Toast from "react-native-toast-message";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const SESSION_EXPIRED_MESSAGE = "Session expired, login again";
let hasShownSessionExpiredAlert = false;

const isLoginRequest = (url?: string) => url === "/auth/login";
const isAuthRequest = (url?: string) => !!url && url.startsWith("/auth/");

const getErrorMessage = (
  error: AxiosError<ErrorResponse>,
  fallback = "Something went wrong. Please try again.",
) => {
  const responseData = error.response?.data as any;
  const detail = responseData?.detail;

  if (Array.isArray(detail)) {
    return detail[0]?.msg || fallback;
  }

  if (typeof detail === "string") {
    return detail;
  }

  return responseData?.message || error.message || fallback;
};

const showErrorToast = (message: string) => {
  Toast.show({
    type: "errorToast",
    text1: "Error",
    text2: message,
  });
};

const requiresOtpVerification = (error: AxiosError<ErrorResponse>) => {
  const responseData = error.response?.data as any;
  const details = responseData?.details;

  return (
    error.response?.status === 401 &&
    details?.next_step === "verify_otp" &&
    details?.otp_verified === false &&
    !!details?.user_id
  );
};

// Request interceptor with detailed logging
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storage.getToken();
    const skipAuth = (config as any).skipAuth === true;

    console.log("📤 API Request:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      hasToken: !!token,
      data: config.data,
      token,
    });

    if (token && !skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !skipAuth) {
      console.warn("⚠️ No token available for request");
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    hasShownSessionExpiredAlert = false;
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as any;
    const requestUrl = originalRequest?.url;
    const suppressGlobalErrorToast =
      originalRequest?.suppressGlobalErrorToast === true;
    const isAuthenticatedRequest =
      error.response?.status === 401 && !isAuthRequest(requestUrl);

    if (error.response) {
      // Server responded with error
      console.error("❌ API Error Response:", {
        url: error.config?.url,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
      if (
        !suppressGlobalErrorToast &&
        !isLoginRequest(requestUrl) &&
        !requiresOtpVerification(error) &&
        !isAuthenticatedRequest
      ) {
        showErrorToast(getErrorMessage(error));
      }
    } else if (error.request) {
      // Request made but no response
      console.error("❌ No Response from Server:", {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        timeout: error.config?.timeout,
        message: error.message,
      });
    } else {
      // Something else happened
      console.error("❌ Request Setup Error:", error.message);
    }

    // Check for 401 and ensure we haven't already tried to retry this specific request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest(requestUrl)
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔑 Access token expired. Attempting refresh...");

        // 1. Pull the stored refresh token
        const refreshToken = await storage.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token stored");
        }

        // 2. Call the refresh endpoint
        // Use a clean axios instance to avoid interceptor interference
        const response = await axios.post<string>(
          `${API_CONFIG.BASE_URL}/token/refresh`,
          { refresh_token: refreshToken },
        );

        const newAccessToken = response.data;

        // 3. Save the new token to storage
        await storage.setToken(newAccessToken);

        // 4. Update the header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log("✅ Token refreshed. Retrying original request...");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);

        // If refresh fails, we must log out
        const logout = useUserStore.getState().logout;
        await logout();
        navigateAndReset("Auth", { screen: "Login" });

        if (!hasShownSessionExpiredAlert) {
          hasShownSessionExpiredAlert = true;
          showErrorToast(SESSION_EXPIRED_MESSAGE);
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors as usual
    return Promise.reject(error);
  },
);

export default apiClient;
