export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship_type: string;
  is_primary: boolean;
}

export interface EmergencyContactsResponse {
  success: boolean;
  message: string;
  data: EmergencyContact[];
}

export interface UpdateConsentPayload {
  consent_emergency_services: boolean;
  consent_privacy_policy: boolean;
  consent_terms_of_service: boolean;
  consent_data_location: boolean;
}

export interface ConsentResponse {
  success: boolean;
  message: string;
  data: {
    consent_emergency_services: boolean;
    consent_privacy_policy: boolean;
    consent_terms_of_service: boolean;
    consent_data_location: boolean;
    consent_accepted_at: string;
  };
}

export interface UserProfile {
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
  role: "rider" | "driver" | string;
  business_id: string;
  is_active: boolean;
  is_guest: boolean;
  consent_emergency_services: boolean;
  consent_privacy_policy: boolean;
  consent_terms_of_service: boolean;
  consent_data_location: boolean;
  consent_accepted_at: string;
  onboarding_step: number;
  onboarding_completed: boolean;
}

export interface UserProfileResponse {
  success: boolean;
  message: string | null;
  data: UserProfile;
  [key: string]: any;
}

export interface SavedLocation {
  id: string;
  label: string; // e.g., "Home", "General Hospital"
  location_type: string; // e.g., "home", "work", "other"
  address: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  notes?: string;
  is_default: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SavedLocationsResponse {
  success: boolean;
  message: string;
  data: SavedLocation[];
}

export interface CreateLocationPayload {
  label: string;
  location_type: "home" | "work" | "other" | string;
  address: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  notes?: string;
  is_default: boolean;
}

export interface CreateLocationResponse {
  success: boolean;
  message: string;
  data: SavedLocation;
}

export interface ForgotPasswordRequest {
  email?: string;
  phone?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: {
    user_id: string;
    message: string;
  };
}

export interface ResetPasswordRequest {
  user_id: string;
  code: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: string | null;
}

export interface UpdateLocationRequest {
  label: string;
  location_type: "home" | "work" | "other" | string;
  address: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  notes?: string;
  is_default: boolean;
}

export interface CreateEmergencyContactRequest {
  name: string;
  phone: string;
  relationship_type: string;
  is_primary: boolean;
}

export interface UpdateStatusPayload {
  is_online: boolean;
}

export interface DriverStatusResponse {
  success: boolean;
  message: string;
  data: {
    is_online: boolean;
    user_id: string;
  };
}

export interface DriverProfile {
  user_id: string;
  business_id: string;
  license_number: string;
  license_expiry: string;
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_plate: string;
  vehicle_color: string;
  vehicle_vin: string;
  vehicle_photo_url: string;
  vehicle_verified: boolean;
  background_check_status: string;
  is_approved: boolean;
  is_online: boolean;
  rating: number;
  total_trips: number;
}

export interface DriverProfileResponse {
  success: boolean;
  message: string;
  data: DriverProfile;
}

export interface UpdateDriverPayload {
  license_number?: string;
  license_expiry?: string;
  vehicle_type?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_plate?: string;
  vehicle_color?: string;
  vehicle_vin?: string;
}

export interface VehicleDetails {
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_plate: string;
  vehicle_color: string;
  vehicle_vin: string;
  vehicle_photo_url: string;
  vehicle_verified: boolean;
}

export interface VehicleResponse {
  success: boolean;
  message: string;
  data: VehicleDetails;
}

export interface UpdateVehiclePayload {
  vehicle_type?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_plate?: string;
  vehicle_color?: string;
  vehicle_vin?: string;
}

export interface DriverDocument {
  id: string;
  document_type: string;
  file_name: string;
  verification_status: "pending" | "verified" | "rejected";
  created_at: string;
}

export interface DocumentListResponse {
  success: boolean;
  message: string;
  data: DriverDocument[];
}

export interface DriverSettings {
  push_ride_updates: boolean;
  push_chat_messages: boolean;
  push_earnings: boolean;
  push_promotions: boolean;
  email_ride_receipts: boolean;
  email_weekly_summary: boolean;
  sms_ride_updates: boolean;
  share_location_with_rider: boolean;
  show_profile_photo: boolean;
  show_rating: boolean;
  allow_data_analytics: boolean;
  language: string;
  distance_unit: "km" | "miles";
  theme: "light" | "dark" | "system";
  auto_accept_rides: boolean;
  navigation_app: "google_maps" | "waze" | "apple_maps";
  sound_enabled: boolean;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data: DriverSettings;
}

export interface UpdateNotificationsPayload {
  push_ride_updates?: boolean;
  push_chat_messages?: boolean;
  push_earnings?: boolean;
  push_promotions?: boolean;
  email_ride_receipts?: boolean;
  email_weekly_summary?: boolean;
  sms_ride_updates?: boolean;
}

export interface UpdatePrivacyPayload {
  share_location_with_rider?: boolean;
  show_profile_photo?: boolean;
  show_rating?: boolean;
  allow_data_analytics?: boolean;
}
