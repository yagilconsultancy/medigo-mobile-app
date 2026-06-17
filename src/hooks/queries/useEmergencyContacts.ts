import { useQuery } from "@tanstack/react-query";
import userService from "../../api/services/userService";

export const useEmergencyContacts = () => {
  return useQuery({
    queryKey: ["emergency-contacts"],
    queryFn: () => userService.getEmergencyContacts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
