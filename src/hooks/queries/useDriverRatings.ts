import { useQuery } from "@tanstack/react-query";
import rideService from "../../api/services/rideService";

export const useMyRatings = () => {
  return useQuery({
    queryKey: ["driver-my-ratings"],
    queryFn: () => rideService.getMyRatings(),
    staleTime: 1000 * 60,
  });
};

export const useDriverStats = () => {
  return useQuery({
    queryKey: ["driver-stats"],
    queryFn: () => rideService.getDriverStats(),
    staleTime: 1000 * 60,
  });
};
