import { useQuery } from "@tanstack/react-query";
import rideService from "../../api/services/rideService";

export const useGetRideTimeline = (rideId: string) => {
  return useQuery({
    queryKey: ["rideTimeline", rideId],
    queryFn: () => rideService.getRideTimeline(rideId),
    enabled: !!rideId, // Only execute query if a valid rideId string is provided
    staleTime: 1000 * 15, // Consider data fresh for 15 seconds (good for live tracking components)
    refetchInterval: 30000, // Optional: Auto-poll backend timeline changes every 30 seconds
  });
};
