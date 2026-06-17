import { useQuery } from "@tanstack/react-query";
import userService from "../../api/services/userService";

export const useDriverVehicle = () => {
  return useQuery({
    queryKey: ["driver-vehicle"],
    queryFn: () => userService.getVehicleDetails(),
    staleTime: 1000 * 60 * 30, // Vehicle details rarely change (30 mins)
  });
};
