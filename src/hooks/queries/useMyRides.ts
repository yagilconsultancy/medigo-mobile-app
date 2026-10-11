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

// Only rides that are still ahead of the rider (requested, confirmed, driver
// assigned or on the way, in progress), soonest first. The server returns the
// newest first, so the order is flipped here.
export const useUpcomingRides = () => {
  return useQuery({
    queryKey: ["my-rides", { status: "upcoming" }],
    queryFn: () => rideService.getRiderRides({ status: "upcoming" }),
    staleTime: 1000 * 30,
    select: (response) => {
      const rides = Array.isArray(response?.data) ? [...response.data] : [];
      rides.sort(
        (a: any, b: any) =>
          new Date(a?.scheduled_at ?? 0).getTime() -
          new Date(b?.scheduled_at ?? 0).getTime(),
      );
      return { ...response, data: rides };
    },
  });
};
