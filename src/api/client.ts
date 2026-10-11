import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_CONFIG } from "../utils/constants";
import { storage } from "../utils/storage";
import { ErrorResponse } from "../types/auth.types";
import { signOut } from "../utils/signOut";
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

type RefreshOutcome =
  | { ok: true; accessToken: string }
  | { ok: false; sessionInvalid: boolean };

// Every request that gets a 401 at the same moment shares ONE refresh call.
// The server rotates the refresh token on each use, so two parallel refreshes
// would make the second one fail and log the user out.
let refreshInFlight: Promise<RefreshOutcome> | null = null;

const refreshAccessToken = (): Promise<RefreshOutcome> => {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async (): Promise<RefreshOutcome> => {
    try {
      const refreshToken = await storage.getRefreshToken();
      if (!refreshToken) {
        return { ok: false, sessionInvalid: true };
      }

      // A clean axios call, so the interceptors below are not involved.
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        { timeout: 15000 },
      );

      const tokens = response.data?.data;
      const newAccessToken: string | undefined = tokens?.access_token;
      if (!newAccessToken) {
        return { ok: false, sessionInvalid: true };
      }

      await storage.setToken(newAccessToken);
      if (tokens?.refresh_token) {
        await storage.setRefreshToken(tokens.refresh_token);
      }

      return { ok: true, accessToken: newAccessToken };
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;
      // Only a clear "this token is no good" answer ends the session. A bad
      // connection or a server hiccup must not log anyone out.
      return { ok: false, sessionInvalid: status === 401 || status === 403 };
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
};

// Request interceptor with detailed logging
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storage.getToken();
    const skipAuth = (config as any).skipAuth === true;

    if (__DEV__) {
      console.log("📤 API Request:", {
        url: `${config.baseURL}${config.url}`,
        method: config.method?.toUpperCase(),
        hasToken: !!token,
      });
    }

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
      if (__DEV__) {
        console.error("❌ API Error Response:", {
          url: error.config?.url,
          status: error.response.status,
        });
      }
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

      const outcome = await refreshAccessToken();

      if (outcome.ok) {
        originalRequest.headers.Authorization = `Bearer ${outcome.accessToken}`;
        return apiClient(originalRequest);
      }

      if (outcome.sessionInvalid) {
        // The refresh token is missing, expired or revoked: sign out for real.
        await signOut({ callServer: false });
        navigateAndReset("Auth", { screen: "Login" });

        if (!hasShownSessionExpiredAlert) {
          hasShownSessionExpiredAlert = true;
          showErrorToast(SESSION_EXPIRED_MESSAGE);
        }
      }

      // Otherwise it was only a connection problem: keep the user signed in
      // and let this one request fail.
      return Promise.reject(error);
    }

    // Handle other errors as usual
    return Promise.reject(error);
  },
);

export default apiClient;
