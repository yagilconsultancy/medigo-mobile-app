import { useQuery } from "@tanstack/react-query";
import rideService from "../../api/services/rideService";

export const useDriverUpcomingRides = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["upcoming-rides", page, limit],
    queryFn: () => rideService.getUpcomingRides(page, limit),
    // Refresh list every 2 minutes to keep the schedule updated
    refetchInterval: 1000 * 60 * 2,
    // Keep data fresh while navigating between tabs
    staleTime: 1000 * 30,
  });
};
