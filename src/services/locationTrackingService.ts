import { io, Socket } from "socket.io-client";
import * as Location from "expo-location";

class LocationTrackingService {
  private socket: Socket | null = null;
  private locationSubscription: Location.LocationSubscription | null = null;
  private isTracking: boolean = false;
  private currentRideId: string | null = null;

  // ✅ CONNECT SOCKET
  connect(
    jwtToken: string,
    onConnected?: () => void,
    backendUrl: string = "https://staging.getmedigo.com",
  ) {
    if (this.socket?.connected) return;

    this.socket = io("https://staging.getmedigo.com/tracking", {
      // URL + Namespace
      path: "/api/v1/ws/socket.io", // Matches documentation exactly
      transports: ["websocket", "polling"],
      auth: { token: jwtToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000, // Added based on docs
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected:", this.socket?.id);
    });

    this.socket.on("connect_error", (error: any) => {
      console.log("❌ FULL ERROR:", error);
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("🔌 Disconnected:", reason);
    });
  }

  // ✅ JOIN RIDE
  joinRide(rideId: string) {
    if (!this.socket?.connected) return;

    this.currentRideId = rideId;

    this.socket.emit("join_ride", {
      ride_id: rideId,
    });
  }

  // ✅ LEAVE RIDE
  leaveRide(rideId: string) {
    if (!this.socket?.connected) return;

    this.socket.emit("leave_ride", {
      ride_id: rideId,
    });

    this.currentRideId = null;
  }

  // ✅ START TRACKING
  async startTracking(rideId: string) {
    if (this.isTracking) return;

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission denied");
    }

    this.joinRide(rideId);

    this.locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) => this.sendLocationUpdate(location),
    );

    this.isTracking = true;
  }

  sendLocationUpdate(location: Location.LocationObject) {
    if (!this.socket?.connected || !this.currentRideId) return;

    console.log("📍 Sending location for ride:", this.currentRideId);

    this.socket.emit("update_location", {
      ride_id: this.currentRideId, // CRITICAL: Added this
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      heading: location.coords.heading ?? 0,
      speed: location.coords.speed ?? 0,
    });
  }

  // ✅ STOP TRACKING
  stopTracking(rideId: string) {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }

    this.leaveRide(rideId);
    this.isTracking = false;
  }

  // ✅ DISCONNECT
  disconnect() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.isTracking = false;
    this.currentRideId = null;
  }
}

export default new LocationTrackingService();
