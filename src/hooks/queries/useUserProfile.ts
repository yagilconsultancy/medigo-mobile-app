import { useQuery } from "@tanstack/react-query";
import userService from "../../api/services/userService";

export const useUserProfile = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: userService.userProfile,
    enabled: options?.enabled ?? true,
  });
};
