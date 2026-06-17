export interface User {
  id: string;
  phone_number: string;
  email?: string;
  name?: string;
  profile_picture?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user_id: User;
  message?: string;
}

export interface RequestOTPPayload {
  phone_number: string;
  otp_delivery_method: "sms" | "whatsapp";
  role: "rider";
}

export interface ResendOTPPayload {
  phoneNumber: string;
  otp_delivery_method: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ErrorResponse {
  detail: string | ValidationError[];
}
export interface OTPResponse {
  message: string;
  status?: string; // Optional if not always present
}

export interface RegisterPayload {
  identifier?: string;
  email?: string;
  phone?: string;
  password: string;
  role: "rider" | "driver";
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user_id: string;
    message: string;
  };
}

export interface VerifyOTPPayload {
  user_id: string;
  code: string;
  purpose: "registration" | "login" | "password_reset";
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  data: {
    verified: boolean;
    message: string;
  };
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  date_of_birth: string; // Format: YYYY-MM-DD
  gender: string;
  avatar_url?: string;
  home_address: string;
  medical_notes?: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    avatar_url: string;
    home_address: string;
    medical_notes: string;
    role: string;
    onboarding_step: number;
    onboarding_completed: boolean;
  };
}

export type OtpPurpose =
  | "registration"
  | "forgot_password"
  | "login"
  | "change_phone";

export interface ResendOtpParams {
  user_id: string; // UUID
  purpose?: OtpPurpose;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  data: string | null;
}

export interface DriverRegisterRequest {
  invite_token: string;
  password: string;
}

export interface DriverRegisterResponse {
  success: boolean;
  message: string;
  data: {
    user_id: string; // UUID
    message: string;
  };
}

export interface RegisterDriverPayload {
  invite_token: string;
  password: string;
}

// The API returns a simple string on success (e.g., an auth token or success message)
export type RegisterDriverResponse = string;
