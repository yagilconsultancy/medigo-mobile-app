export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  VERIFY_OTP: "/auth/verify-otp",
} as const;

export const RIDE_ENDPOINTS = {
  GET_RIDE_TIMELINE: (rideId: string) => `/rides/${rideId}/timeline`,
} as const;
