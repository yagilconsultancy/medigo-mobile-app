import { useQuery } from "@tanstack/react-query";
import rideService from "../../api/services/rideService";

export const useActiveRide = () => {
  return useQuery({
    queryKey: ["activeRide"],
    queryFn: rideService.getActiveRide,
    // Refetch every 15 seconds to keep the UI updated on driver progress
    refetchInterval: 15000,
    // Only fetch when the app is focused
    refetchOnWindowFocus: true,
  });
};
