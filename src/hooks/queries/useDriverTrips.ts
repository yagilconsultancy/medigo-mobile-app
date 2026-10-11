import { useQuery } from "@tanstack/react-query";
import rideService from "../../api/services/rideService";

export type DriverTripTab = "upcoming" | "completed" | "cancelled";

export const useDriverTrips = (status: DriverTripTab) => {
  return useQuery({
    queryKey: ["driver-trips", status],
    queryFn: () => rideService.getDriverTrips(status),
    // Soonest trip first for upcoming; newest first for completed/cancelled
    // (the server already returns newest first).
    select: (res) =>
      status === "upcoming"
        ? {
            ...res,
            data: [...(res.data ?? [])].sort(
              (a, b) =>
                new Date(a.scheduled_at).getTime() -
                new Date(b.scheduled_at).getTime(),
            ),
          }
        : res,
    refetchInterval: status === "upcoming" ? 1000 * 60 * 2 : false,
    staleTime: 1000 * 30,
  });
};
