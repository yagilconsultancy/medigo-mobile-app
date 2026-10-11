type PassengerFields = {
  passenger_first_name?: string | null;
  passenger_last_name?: string | null;
  passenger_phone?: string | null;
  rider_name?: string | null;
};

/**
 * Who is actually being driven. The backend sends passenger_* fields when the
 * booking is for someone other than the account holder; otherwise the
 * passenger is the rider who booked (rider_name).
 */
export const getPassengerName = (ride?: PassengerFields | null): string => {
  if (!ride) return "";
  const full = [ride.passenger_first_name, ride.passenger_last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return full || ride.rider_name?.trim() || "";
};

/** The backend only exposes passenger_phone (there is no rider_phone). */
export const getPassengerPhone = (ride?: PassengerFields | null): string =>
  ride?.passenger_phone?.trim() || "";
