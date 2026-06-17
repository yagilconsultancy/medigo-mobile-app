import { useEffect, useState } from "react";
import RideTrackingService from "../services/rideTrackingService";

interface DriverLocation {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  eta_minutes?: number;
  distance_remaining_miles?: number;
}

export const useRideTracking = (rideId: string | null, token: string | null) => {
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(
    null,
  );
  const [eta, setEta] = useState<number | null>(null);

  useEffect(() => {
    if (!token || !rideId) {
      console.log("⏳ useRideTracking: Missing token or rideId, waiting...");
      return;
    }

    console.log(`🔌 Attempting tracking session init for Ride: ${rideId}`);

    // Connect to the Socket namespace server cleanly
    RideTrackingService.connect(token, () => {
      console.log(
        `🎯 Socket connection verified. Issuing room join for: ${rideId}`,
      );
      RideTrackingService.joinRide(rideId);
    });

    // Handle real-time telemetry payload streams
    RideTrackingService.onLocationUpdate((data) => {
      console.log("──────────────────────────────────────────");
      console.log("📍 LIVE DRIVER TELEMETRY RECEIVED:");
      console.log(`🌐 Lat/Lng: ${data.latitude}, ${data.longitude}`);
      console.log(`⏱️ ETA: ${data.eta_minutes} mins`);
      console.log("──────────────────────────────────────────");

      setDriverLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading,
        speed: data.speed,
        eta_minutes: data.eta_minutes,
        distance_remaining_miles: data.distance_remaining,
      });

      if (data.eta_minutes !== undefined) {
        setEta(data.eta_minutes);
      }
    });

    // 🛡️ DIAGNOSTIC CAPTURE 1: Listen for Structural Life Cycle Starts
    // @ts-ignore (If not typed in your service yet)
    RideTrackingService.socket?.on("tracking_started", (data) => {
      console.log(
        "🚀 SERVER CONFIRMED: Tracking session has officially started!",
        data,
      );
    });

    // 🛡️ DIAGNOSTIC CAPTURE 2: Listen for tracking session drops/ends
    // @ts-ignore
    RideTrackingService.socket?.on("tracking_ended", (data) => {
      console.log(
        "🛑 SERVER CONFIRMED: Tracking session ended. Reason:",
        data?.reason,
      );
    });

    // Cleanup channels completely on screen teardown/unmount
    return () => {
      console.log("🧹 useRideTracking cleaning up listeners...");
      // @ts-ignore
      RideTrackingService.socket?.off("tracking_started");
      // @ts-ignore
      RideTrackingService.socket?.off("tracking_ended");

      RideTrackingService.leaveRide(rideId);
      RideTrackingService.removeLocationListener();
      RideTrackingService.disconnect();
    };
  }, [token, rideId]);

  return { driverLocation, eta };
};
