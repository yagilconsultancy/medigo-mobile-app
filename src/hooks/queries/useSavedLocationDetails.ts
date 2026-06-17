import { useQuery } from "@tanstack/react-query";
import userService from "../../api/services/userService";

export const useSavedLocationDetails = (locationId: string) => {
  return useQuery({
    queryKey: ["saved-locations", locationId],
    queryFn: () => userService.getSavedLocationById(locationId),
    enabled: !!locationId, // Only run the query if an ID is actually provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
