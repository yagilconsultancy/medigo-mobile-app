import Constants from "expo-constants";

const DEFAULT_API_BASE_URL = "https://prod-api.getmedigo.com/api/v1";
// Local/staging testing can point the app at another backend with
// EXPO_PUBLIC_API_BASE_URL in .env. When it is not set, the app uses the
// address from app.config.js (production), exactly as before.
const configuredApiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  Constants.expoConfig?.extra?.apiBaseUrl;

export const API_CONFIG = {
  BASE_URL:
    typeof configuredApiBaseUrl === "string"
      ? configuredApiBaseUrl
      : DEFAULT_API_BASE_URL,
  TIMEOUT: 60000,
} as const;

// Socket.IO lives on the same host as the REST API.
export const SOCKET_BASE_URL = API_CONFIG.BASE_URL.replace(/\/api\/v1\/?$/, "");

export const WEB_CONFIG = {
  SITE_BASE_URL: "https://getmedigo.com",
} as const;

export const RIDE_CONFIG = {
  DEFAULT_BUSINESS_ID:
    process.env.EXPO_PUBLIC_DEFAULT_BUSINESS_ID ??
    "00000000-0000-0000-0000-000000000010",
} as const;

export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "user_data",
  REFRESH_TOKEN: "refresh_token",
  USER_ID: "user_id",
  PHONE: "userPhoneNumber",
};

export const OTP_DELIVERY_METHODS = {
  SMS: "sms",
  WHATSAPP: "whatsapp",
} as const;
