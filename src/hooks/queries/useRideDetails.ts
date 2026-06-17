import { useQuery } from "@tanstack/react-query";
import rideService from "../../api/services/rideService";

export const useRideDetail = (rideId: string) => {
  return useQuery({
    queryKey: ["ride-detail", rideId],
    queryFn: () => rideService.getRideDetail(rideId),
    enabled: !!rideId, // Only run if a rideId is actually provided
    staleTime: 1000 * 30, // Data is fresh for 30 seconds
  });
};
