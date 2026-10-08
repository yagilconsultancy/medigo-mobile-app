export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  VERIFY_OTP: "/auth/verify-otp",
  DRIVER_ACTIVATION_CHECK: "/auth/driver/activation/check",
  DRIVER_ACTIVATION_REQUEST_CODE: "/auth/driver/activation/request-otp",
  DRIVER_ACTIVATION_COMPLETE: "/auth/driver/activation/complete",
} as const;

export const RIDE_ENDPOINTS = {
  GET_RIDE_TIMELINE: (rideId: string) => `/rides/${rideId}/timeline`,
} as const;
