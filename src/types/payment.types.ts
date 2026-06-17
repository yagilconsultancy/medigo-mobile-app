export interface AddPaymentPayload {
  method_type: string; // e.g., "card"
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  holder_name: string;
  cvd: string;
}

export interface PaymentMethodResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    user_id: string;
    method_type: string;
    last_four: string;
    brand: string;
    holder_name: string;
    is_default: boolean;
    created_at: string;
  };
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  method_type: string;
  last_four: string;
  brand: string;
  holder_name: string;
  is_default: boolean;
  created_at: string;
}

export interface PaymentMethodsResponse {
  success: boolean;
  message: string;
  data: PaymentMethod[];
}

export interface WalletBalance {
  available_balance: number;
  total_earned: number;
  total_withdrawn: number;
  pending_withdrawal: number;
}

export interface WalletResponse {
  success: boolean;
  message: string;
  data: WalletBalance;
}

export interface EarningsSummary {
  available_balance: number;
  next_payout_date: string;
  next_payout_method: string;
  earnings_today: number;
  earnings_today_change_percent: number;
  trips_today: number;
  hours_today: number;
  avg_earnings_per_trip: number;
}

export interface EarningsSummaryResponse {
  success: boolean;
  message: string;
  data: EarningsSummary;
}

export interface EarningsHistoryItem {
  date: string;
  label: string; // e.g., "Mon", "Tue"
  trip_count: number;
  earnings: number;
  change_percent: number;
}

export interface EarningsHistoryResponse {
  success: boolean;
  message: string;
  data: EarningsHistoryItem[];
}

export interface FareEstimatePayload {
  pickup_address?: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  destination_address?: string;
  destination_latitude?: number;
  destination_longitude?: number;
  scheduled_at?: string;
  use_highway_407?: boolean;
  is_dialysis_trip?: boolean;
  ride_type?: string;
  trip_type?: string;
  trip_structure?: string;
}

export interface FareEstimateResponse {
  success: boolean;
  message: string | null;
  data: {
    distance_km: number;
    estimates: FareEstimate[];
    currency: string;
    note: string;
    estimated_at: string;
  };
}

export interface FareCancellationFee {
  cancellation_window: string;
  fee: string;
}

export interface FareEstimate {
  service_type: string;
  display_name: string;
  base_fare: number;
  distance_charge: number;
  estimated_total: number;
  wait_time_charge: number;
  surcharges_total: number;
  surcharges_capped: number;
  highway_407_toll: number;
  insurance_gateway_fee: number;
  flat_surcharge: number;
  platform_fee: number;
  driver_earnings: number;
  care_assistant_fee: number;
  accessibility_fee: number;
  attendant_fee: number;
  rate_card_version: number;
  ride_type: string;
  trip_type: string;
  is_round_trip: boolean;
  return_distance_charge: number;
  cancellation_fees: FareCancellationFee[];
  description: string;
  passengers: string;
  best_for: string;
  features: string[];
}

export interface BaseFareSurchargeDetail {
  type: string;
  name: string;
  amount: number;
}

export interface BaseFareEstimateResponse {
  success: boolean;
  message: string | null;
  data: {
    distance_km: number;
    distance_miles: number;
    duration_minutes: number;
    base_fare: number;
    distance_charge: number;
    wait_time_charge: number;
    surcharges_total: number;
    surcharges_capped: number;
    surcharge_details: BaseFareSurchargeDetail[];
    highway_407_toll: number;
    insurance_gateway_fee: number;
    flat_surcharge: number;
    platform_fee: number;
    total_fare: number;
    driver_earnings: number;
    is_dialysis_rate: boolean;
    rate_card_version: number;
    care_assistant_fee: number;
    accessibility_fee: number;
    attendant_fee: number;
    is_round_trip: boolean;
    return_distance_charge: number;
    ride_type: string;
    trip_type: string;
    cancellation_fees: FareCancellationFee[];
    currency: string;
    estimated_at: string;
  };
}
export interface PaymentIntentPayload {
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  metadata?: Record<string, string>;
  customer_session_api_version?: string;
  setup_future_usage?: "on_session" | "off_session";
}

export interface PaymentIntentResponse {
  success: boolean;
  message: string;
  data: {
    payment_intent: string;
    payment_intent_id: string;
    customer: string;
    ephemeral_key: string;
    publishable_key: string;
    amount: number;
    currency: string;
  };
}

export interface WithdrawalPayload {
  amount: number;
  payment_method_id?: string;
}

// 2. Declare the response structures matching your Swagger spec
export interface WithdrawalData {
  id: string;
  driver_id: string;
  amount: number;
  transaction_fee: number;
  net_amount: number;
  payment_method_id: string;
  status: string;
  processed_at: string; // ISO Timestamp
  failure_reason: string | null;
  created_at: string; // ISO Timestamp
}

export interface WithdrawalResponse {
  success: boolean;
  message: string;
  data: WithdrawalData;
}

export interface WithdrawalFeeData {
  amount: number;
  transaction_fee: number;
  net_amount: number;
}

export interface WithdrawalFeeResponse {
  success: boolean;
  message: string;
  data: WithdrawalFeeData;
}
