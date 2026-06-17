import { useEffect } from "react";
import { requestLocationPermission } from "../services/location";

export default function useLocationTracking(): void {
  useEffect(() => {
    requestLocationPermission();
  }, []);
}
