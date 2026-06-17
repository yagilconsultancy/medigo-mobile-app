export interface Ride {
  id: string;
  rider_id: string;
  driver_id: string | null;
  business_id: string;
  ride_type: string;
  trip_type: string;
  trip_structure: string;
  pickup_address: string;
  destination_address: string;
  scheduled_at: string;
  status:
    | "pending"
    | "accepted"
    | "in_progress"
    | "completed"
    | "cancelled"
    | string;
  estimated_distance_miles: number;
  estimated_duration_minutes: number;
  estimated_fare: number;
  final_fare: number;
  special_instructions: string;
  visit_type: string;
  facility_name: string;
  created_at: string;
}

export interface RidesResponse {
  success: boolean;
  data: Ride[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface RidesQueryParams {
  status?: string | null;
  page?: number;
  limit?: number;
}

export interface CreateRideRequest {
  ride_type: string;
  trip_type: "transport_only" | "transport_care_assistant" | string;
  trip_structure: "one_way" | "round_trip";
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  scheduled_at: string; // ISO String
  passenger_id?: string;
  passenger_first_name: string;
  passenger_last_name: string;
  passenger_phone: string;
  visit_type: string;
  appointment_time: string; // ISO String
  special_instructions: string;
  assistance_level: string;
  is_dialysis_trip: boolean;
  booking_channel: "mobile_app" | string;
}

export interface UpcomingRide {
  id: string;
  ride_type: string;
  trip_type: string;
  driver_id: string | null;
  driver_name: string | null;
  driver_phone: string | null;
  driver_avatar_url: string | null;
  pickup_address: string;
  rider_name: string | null;
  destination_address: string;
  scheduled_at: string;
  status: string;
  estimated_distance_miles: number;
  estimated_duration_minutes: number;
  estimated_fare: number;
  facility_name?: string;
}

export interface UpcomingRidesResponse {
  success: boolean;
  data: UpcomingRide[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface RideRating {
  id: string;
  ride_id: string;
  rated_user_id: string;
  rated_by_user_id: string;
  rating_type: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface RideDetail {
  id: string;
  rider_id: string;
  driver_id: string;
  ride_type: string;
  rider_phone: string | null;
  trip_type: string;
  trip_structure: string;
  appointment_time: string;
  estimated_distance_miles: number;
  actual_distance_miles: number | null;
  actual_duration_minutes: number | null;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  estimated_duration_minutes: number;
  status: string;
  estimated_fare: number;
  final_fare: number;
  rider_name: string;
  rider_rating: number;
  rider_trip_count: number;
  special_instructions: string;
  mobility_level: string;
  assistance_level: string;
  driver_rating?: RideRating; // Rating driver gave rider
  rider_rating_given?: RideRating; // Rating rider gave driver
  timeline: any[];
  scheduled_at: string;
  created_at: string;
}

export interface RideDetailResponse {
  success: boolean;
  message: string;
  data: RideDetail;
}

export type RideStatus =
  | "accepted"
  | "arrived"
  | "picked_up"
  | "dropped_off"
  | "cancelled";

export interface UpdateStatusPayload {
  status: RideStatus;
  notes?: string;
}

export interface TimelineEvent {
  from_status: string;
  to_status: string;
  timestamp: string;
  notes: string | null;
}

export interface TimelineResponse {
  success: boolean;
  message: string;
  data: TimelineEvent[];
}

export interface CancelRidePayload {
  reason: string;
}

export interface ActiveRideResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    rider_id: string;
    driver_id: string | null;
    pickup_address: string;
    destination_address: string;
    status: string;
    estimated_fare: number;
    scheduled_at: string;
    driver_avatar_url: string | null;
    driver_name: string | null;
    driver_phone: string | null;
    estimated_duration_minutes: number;
  } | null;
}

export interface ShareRideResponse {
  success: boolean;
  message: string;
  data: {
    ride_id: string;
    share_token: string;
    share_url: string; // The link we want to share
  };
}

export type RideStatusType =
  | "searching"
  | "accepted"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface UpdateRideStatusPayload {
  status: RideStatusType | string;
  notes?: string;
}

export interface RideDataResponse {
  id: string;
  rider_id: string;
  driver_id: string | null;
  caregiver_id: string | null;
  business_id: string | null;
  ride_type: string;
  trip_type: string;
  trip_structure: string;
  pickup_address: string;
  destination_address: string;
  scheduled_at: string;
  status: RideStatusType | string;
  passenger_id: string | null;
  passenger_first_name: string;
  passenger_last_name: string;
  passenger_phone: string;
  estimated_distance_miles: number;
  estimated_duration_minutes: number;
  estimated_fare: number;
  final_fare: number;
  special_instructions: string | null;
  visit_type: string | null;
  facility_name: string | null;
  booking_channel: "mobile_app" | string;
  facility_id: string | null;
  guest_session_id: string | null;
  recurring_ride_id: string | null;
  use_highway_407: boolean;
  highway_407_route: string | null;
  is_dialysis_trip: boolean;
  created_at: string;
  rider_name: string;
  driver_name: string | null;
  driver_phone: string | null;
  driver_avatar_url: string | null;
  driver_rating: number;
  driver_vehicle_type: string | null;
  driver_vehicle_make: string | null;
  driver_vehicle_model: string | null;
  driver_vehicle_color: string | null;
  driver_vehicle_plate: string | null;
}

export interface UpdateRideStatusResponse {
  success: boolean;
  message: string;
  data: RideDataResponse;
}

export interface TimelineStep {
  from_status: string;
  to_status: string;
  timestamp: string; // ISO Date String
  notes: string | null;
}

export interface RideTimelineResponse {
  success: boolean;
  message: string;
  data: TimelineStep[];
}
