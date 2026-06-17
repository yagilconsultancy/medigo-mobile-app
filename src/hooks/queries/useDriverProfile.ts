import { useQuery } from "@tanstack/react-query";
import userService from "../../api/services/userService";

export const useDriverProfile = () => {
  return useQuery({
    queryKey: ["driver-profile-me"],
    queryFn: () => userService.getDriverProfile(),
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
  });
};
