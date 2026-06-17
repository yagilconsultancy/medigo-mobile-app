import { useQuery } from "@tanstack/react-query";
import userService from "../../api/services/userService";

export const useDriverSettings = () => {
  return useQuery({
    queryKey: ["driver-settings"],
    queryFn: () => userService.getSettings(),
    staleTime: 1000 * 60 * 60, // Settings rarely change, keep fresh for 1 hour
  });
};
