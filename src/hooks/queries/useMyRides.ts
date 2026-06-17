import { useQuery } from "@tanstack/react-query";
import { RidesQueryParams } from "../../types/rides.types";
import rideService from "../../api/services/rideService";

export const useMyRides = (queryParams: RidesQueryParams = {}) => {
  return useQuery({
    queryKey: ["my-rides", queryParams],
    queryFn: () => rideService.getRiderRides(queryParams),
    staleTime: 1000 * 30, // 30 seconds
  });
};
