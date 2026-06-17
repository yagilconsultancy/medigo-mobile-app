import Constants from "expo-constants";

const DEFAULT_API_BASE_URL = "https://staging.getmedigo.com/api/v1";
const configuredApiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

export const API_CONFIG = {
  BASE_URL:
    typeof configuredApiBaseUrl === "string"
      ? configuredApiBaseUrl
      : DEFAULT_API_BASE_URL,
  TIMEOUT: 60000,
} as const;

export const WEB_CONFIG = {
  PORTFOLIO_BASE_URL: "https://medigo-portfolio.vercel.app",
} as const;

export const DELETE_ACCOUNT_URL = "https://yagildigitalstudios.com/medigo-delete-account";

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
