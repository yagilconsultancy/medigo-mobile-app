import { useQuery } from "@tanstack/react-query";
import userService from "../../api/services/userService";

export const useSavedLocations = () => {
  return useQuery({
    queryKey: ["saved-locations"],
    queryFn: () => userService.getSavedLocations(),
    staleTime: 1000 * 60 * 10,
  });
};
