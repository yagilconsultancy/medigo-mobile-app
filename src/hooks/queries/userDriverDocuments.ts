import { useQuery } from "@tanstack/react-query";
import userService from "../../api/services/userService";

export const useDriverDocuments = () => {
  return useQuery({
    queryKey: ["driver-documents"],
    queryFn: () => userService.getDocuments(),
    // Documents don't change often, but status might update while the app is open
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
