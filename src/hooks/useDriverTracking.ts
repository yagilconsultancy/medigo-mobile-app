import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location"; // Using standard Expo Location
import RideTrackingService from "../services/rideTrackingService";

interface DriverLocation {
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
}

const getJwtRole = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload || typeof atob !== "function") return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(normalizedPayload);
    return JSON.parse(decodedPayload)?.role ?? null;
  } catch {
    return null;
  }
};

export const useDriverTracking = (
  activeRideId: string | null,
  driverToken: string | null,
) => {
  const [currentLocation, setCurrentLocation] =
    useState<DriverLocation | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(
    null,
  );

  useEffect(() => {
    // 1. Only track if there is a valid session token and an active ride assignment
    if (!driverToken || !activeRideId) {
      stopTrackingLoop();
      return;
    }

    const tokenRole = getJwtRole(driverToken);
    console.log("🔑 Driver tracking token role:", tokenRole);
    if (tokenRole && tokenRole !== "driver") {
      console.error(
        "❌ Driver tracking blocked: stored auth token is not a driver token.",
      );
      stopTrackingLoop();
      return;
    }

    console.log(`🚕 Initializing Driver Tracking for Ride: ${activeRideId}`);

    // 2. Connect to the namespace (Passing driver token sets up auth credentials)
    RideTrackingService.connect(driverToken, () => {
      console.log("🟢 Driver authenticated and connected to socket server.");
      RideTrackingService.joinRide(activeRideId, (joined) => {
        if (!joined) {
          console.error("❌ Driver tracking session was not created.");
          return;
        }

        startTrackingLoop();
      });
    });

    // 3. Setup global life cycle listeners just for visibility
    // @ts-ignore
    RideTrackingService.socket?.on("tracking_started", (data) => {
      console.log("🚀 Backend tracking session initialized:", data);
    });

    return () => {
      stopTrackingLoop();
      // @ts-ignore
      RideTrackingService.socket?.off("tracking_started");
      RideTrackingService.leaveRide(activeRideId);
      RideTrackingService.disconnect();
    };
  }, [activeRideId, driverToken]);

  const startTrackingLoop = async () => {
    // Request foreground and background location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("❌ Location tracking permission denied by user");
      return;
    }

    const captureAndBroadcastLocation = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude, heading, speed } = location.coords;

        // Documentation requires converting speed from m/s to km/h (speed * 3.6)
        const speedInKmH = speed ? speed * 3.6 : 0;
        const liveLocation = {
          latitude,
          longitude,
          heading: heading ?? null,
          speed: speedInKmH,
        };

        setCurrentLocation(liveLocation);

        RideTrackingService.updateLocation(liveLocation);
      } catch (error) {
        console.error(
          "🚨 Error capturing hardware GPS coordinate packet:",
          error,
        );
      }
    };

    // Clear any loose intervals before spawning a new one
    if (intervalRef.current) clearInterval(intervalRef.current);

    console.log("⏱️ Starting 5-second GPS broadcast interval...");

    await captureAndBroadcastLocation();

    // Per documentation best practices, update every 5 seconds (not every second) to save battery
    intervalRef.current = setInterval(captureAndBroadcastLocation, 5000); // 5000ms = 5 seconds
  };

  const stopTrackingLoop = () => {
    if (intervalRef.current) {
      console.log("🛑 Stopping Driver GPS broadcast interval.");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
      locationSubscriptionRef.current = null;
    }
  };

  return currentLocation;
};
