import { useQuery } from "@tanstack/react-query";
import rideService from "../../api/services/rideService";

export type RiderHistoryFilter = "all" | "completed" | "cancelled";

export interface RiderHistoryOverview {
  success: boolean;
  data: {
    summary: {
      total_rides: number;
      completed_rides: number;
      cancelled_rides: number;
      miles_traveled: number;
    };
    rides: any[];
    filtered_total: number;
    page: number;
    limit: number;
    total_pages: number;
    status_filter: string;
  };
}

// Key starts with "rides-history" so the cancel/status mutations refresh it.
export const useRiderHistoryOverview = (
  status: RiderHistoryFilter,
  limit = 20,
) => {
  return useQuery<RiderHistoryOverview>({
    queryKey: ["rides-history", status, limit],
    queryFn: () =>
      rideService.getRiderHistoryOverview({
        status: status === "all" ? undefined : status,
        page: 1,
        limit,
      }),
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
  });
};
