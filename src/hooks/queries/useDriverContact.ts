import { useQuery } from "@tanstack/react-query";
import rideService from "../../api/services/rideService";

export const useDriverContact = (rideId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["driver-contact", rideId],
    queryFn: () => rideService.getDriverContact(rideId),
    enabled: !!rideId && enabled,
    staleTime: 1000 * 60,
    retry: false,
  });
};
