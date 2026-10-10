import { io, Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "../utils/constants";

interface LocationUpdate {
  ride_id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  eta_minutes?: number;
  distance_remaining?: number;
}

class RideTrackingService {
  private socket: Socket | null = null;
  private currentRideId: string | null = null;
  private hasActiveTrackingSession = false;
  private currentToken: string | null = null;

  // ✅ CONNECT
  connect(
    jwtToken: string,
    onConnected?: () => void,
    backendUrl: string = SOCKET_BASE_URL,
  ) {
    if (this.socket?.connected) {
      if (this.currentToken !== jwtToken) {
        console.log("🔄 Reconnecting tracking socket with updated auth token");
        this.disconnect();
      } else {
        console.log("⚠️ Socket already connected");
        onConnected?.();
        return;
      }
    }

    console.log("🚀 Initializing socket connection...");
    console.log("🌐 URL:", backendUrl);
    console.log("🛣️ Path:", "/ws/socket.io/tracking");
    console.log("🔑 Token present:", !!jwtToken);

    this.socket = io(`${backendUrl}/tracking`, {
      // URL + Namespace
      path: "/api/v1/ws/socket.io", // Matches documentation exactly
      transports: ["websocket", "polling"],
      auth: { token: jwtToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000, // Added based on docs
    });
    this.currentToken = jwtToken;

    // ─────────────────────────────────────────
    // CONNECTION EVENTS
    // ─────────────────────────────────────────

    this.socket.on("connect", () => {
      console.log("✅ CONNECTED");
      console.log("🆔 Socket ID:", this.socket?.id);
      console.log("🚚 Transport:", this.socket?.io?.engine?.transport?.name);

      onConnected?.();
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 DISCONNECTED:", reason);
      this.hasActiveTrackingSession = false;
    });

    this.socket.on("connect_error", (err: any) => {
      console.log("❌ ===== CONNECT ERROR START =====");

      console.log("📛 Message:", err?.message);
      console.log("📛 Name:", err?.name);

      // 🔥 VERY IMPORTANT
      console.log("📄 Description:", err?.description);
      console.log("🧠 Context:", err?.context);

      console.log("📦 Full error object:", err);

      try {
        console.log("🧾 JSON:", JSON.stringify(err, null, 2));
      } catch {
        console.log("⚠️ Could not stringify error");
      }

      console.log("❌ ===== CONNECT ERROR END =====");
    });

    // ─────────────────────────────────────────
    // ENGINE / TRANSPORT DEBUG (CRITICAL)
    // ─────────────────────────────────────────

    this.socket.io.on("error", (error: any) => {
      console.log("🚨 ENGINE ERROR:", error);
    });

    this.socket.io.on("reconnect_attempt", (attempt) => {
      console.log("🔁 Reconnect attempt:", attempt);
    });

    this.socket.io.on("reconnect", () => {
      if (this.currentRideId) {
        console.log("🔁 Rejoining ride after reconnect:", this.currentRideId);
        this.joinRide(this.currentRideId);
      }
    });

    this.socket.io.on("reconnect_error", (error: any) => {
      console.log("🔁 RECONNECT ERROR:", error);
    });

    this.socket.io.on("reconnect_failed", () => {
      console.log("💀 RECONNECT FAILED");
    });

    (this.socket.io as any).on("upgrade_error", (error: any) => {
      console.log("⬆️ UPGRADE ERROR:", error);
    });

    (this.socket.io as any).on("transport", (transport: any) => {
      console.log("🚚 Transport selected:", transport.name);

      transport.on("error", (err: any) => {
        console.log("🚨 TRANSPORT ERROR:", err);
      });
    });
  }

  // ✅ JOIN RIDE ROOM
  joinRide(
    rideId: string,
    onJoined?: (success: boolean, response?: any) => void,
  ) {
    if (!this.socket) {
      console.log("❌ Cannot join ride: socket not initialized");
      onJoined?.(false);
      return;
    }

    if (!this.socket.connected) {
      console.log("⚠️ Cannot join ride: socket not connected yet");
      onJoined?.(false);
      return;
    }

    console.log("🚗 Joining ride:", rideId);
    this.currentRideId = rideId;
    this.hasActiveTrackingSession = false;

    this.socket.emit("join_ride", { ride_id: rideId }, (response: any) => {
      console.log("📦 join_ride ack:", JSON.stringify(response));

      if (response?.error) {
        console.error("❌ Server rejected join_ride:", response.error);
        this.hasActiveTrackingSession = false;
        onJoined?.(false, response);
        return;
      }

      if (this.currentRideId === rideId) {
        this.hasActiveTrackingSession = true;
      }

      console.log("✅ Ride tracking session joined:", rideId);
      onJoined?.(true, response);
    });
  }

  // ✅ LEAVE RIDE ROOM
  leaveRide(rideId: string) {
    if (!this.socket?.connected) {
      console.log("⚠️ Cannot leave ride: socket not connected");
      return;
    }

    console.log("👋 Leaving ride:", rideId);

    this.socket.emit("leave_ride", {
      ride_id: rideId,
    });

    if (this.currentRideId === rideId) {
      this.currentRideId = null;
    }
    this.hasActiveTrackingSession = false;
  }

  // ✅ LISTEN FOR DRIVER LOCATION
  onLocationUpdate(callback: (data: LocationUpdate) => void) {
    if (!this.socket) {
      console.log("❌ Cannot listen: socket not initialized");
      return;
    }

    console.log("👂 Listening for driver location updates...");

    this.socket.on("location_update", (data: LocationUpdate) => {
      console.log("📍 LOCATION UPDATE RECEIVED:");
      console.log("➡️ Ride ID:", data.ride_id);
      console.log("➡️ Driver ID:", data.driver_id);

      callback(data);
    });
  }

  // ✅ REMOVE LISTENER
  removeLocationListener() {
    if (!this.socket) return;

    console.log("🧹 Removing location listeners");

    this.socket.off("location_update");
  }

  // ✅ DISCONNECT
  disconnect() {
    if (!this.socket) {
      console.log("⚠️ No socket to disconnect");
      return;
    }

    console.log("🔌 Disconnecting socket...");

    this.socket.disconnect();
    this.socket = null;
    this.currentRideId = null;
    this.currentToken = null;
    this.hasActiveTrackingSession = false;

    console.log("✅ Socket fully disconnected");
  }

  /**
   * Emits the driver's current GPS telemetry to the tracking namespace.
   * @param telemetry Coordinates, direction, and speed data packets.
   */
  updateLocation(telemetry: {
    latitude: number;
    longitude: number;
    heading: number | null;
    speed: number | null;
  }) {
    if (!this.socket || !this.socket.connected) {
      console.log("⚠️ Cannot update location: Socket is not connected");
      return;
    }
    if (!this.hasActiveTrackingSession) {
      console.log("⚠️ Cannot update location: tracking session is not active");
      return;
    }
    if (!this.currentRideId) {
      console.log("⚠️ Cannot update location: missing ride id");
      return;
    }

    const payload = {
      ride_id: this.currentRideId,
      ...telemetry,
    };

    const emitLocationUpdate = (body: typeof payload) => {
      this.socket?.emit("update_location", body, (response: any) => {
        if (response?.error) {
          console.error(
            "❌ Server rejected driver location update:",
            response.error,
          );
          console.log(
            "📦 Rejected update_location ack:",
            JSON.stringify(response),
          );
        } else {
          console.log(
            `⚡ [GPS Broadcast] Lat: ${telemetry.latitude.toFixed(5)} | Lng: ${telemetry.longitude.toFixed(5)} | Speed: ${telemetry.speed?.toFixed(1)} km/h`,
          );
          if (response) {
            console.log("📦 Server Ack Payload:", JSON.stringify(response));
          }
        }
      });
    };

    emitLocationUpdate(payload);
  }
}

export default new RideTrackingService();
