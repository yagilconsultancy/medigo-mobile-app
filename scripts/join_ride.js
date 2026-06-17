#!/usr/bin/env node
/**
 * MediRide - Connect & Join a Ride
 *
 * Connects to the Socket.IO tracking service and joins a ride room
 * to receive real-time driver location updates.
 *
 * Usage: node scripts/join_ride.js
 */

const { io } = require("socket.io-client");

// ---------------------------------------------------------------------------
// CONFIGURE THESE VALUES
// ---------------------------------------------------------------------------
const RIDE_ID = "17626a2b-56f9-4b12-bc7e-02dff370712b";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ODUzZjNjMS04ZjRlLTRjZDItOGQ0Ni1iNGQxNzg0MWE2MGEiLCJyb2xlIjoiZmFjaWxpdHkiLCJidXNpbmVzc19pZCI6bnVsbCwiZW1haWwiOiJnYWZhcmFkZXR1bmppNDcxK2ZhY2lsaXR5QGdtYWlsLmNvbSIsImp0aSI6Ijg5M2JiZmRiLWI1NWYtNDBkYS1hNDA0LWU1MjU3Mzc0MjcwOCIsImlhdCI6MTc4MDA0NzAwMiwiZXhwIjoxNzgwMDY1MDAyLCJ0eXBlIjoiYWNjZXNzIn0.Saie4PjKK2D9feS1xNnbUyOuimb0Iu0wuuF9q_jqQmI";
const ENV = "staging"; // "local" or "staging"
// ---------------------------------------------------------------------------

const ENVIRONMENTS = {
  local: {
    server: "http://localhost:8080",
    path: "/api/v1/ws/socket.io",
  },
  staging: {
    server: "https://staging.getmedigo.com",
    path: "/api/v1/ws/socket.io",
  },
};

function main() {
  const config = ENVIRONMENTS[ENV];

  console.log("=".repeat(60));
  console.log("  MediRide - Join Ride");
  console.log("=".repeat(60));
  console.log(`  Environment : ${ENV}`);
  console.log(`  Server      : ${config.server}`);
  console.log(`  Ride ID     : ${RIDE_ID}`);
  console.log(`  Auth        : ${TOKEN ? "JWT provided" : "guest (no token)"}`);
  console.log("=".repeat(60));
  console.log("");

  // Build connection options
  const socketOpts = {
    path: config.path,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  };

  if (TOKEN) {
    socketOpts.auth = { token: TOKEN };
  }

  // Connect to /tracking namespace
  const socket = io(`${config.server}/tracking`, socketOpts);

  // -----------------------------------------------------------------------
  // Debug: catch ALL events
  // -----------------------------------------------------------------------
  socket.onAny((event, ...args) => {
    console.log(`[ANY EVENT]  "${event}"`, JSON.stringify(args).slice(0, 200));
  });

  // -----------------------------------------------------------------------
  // Connection lifecycle
  // -----------------------------------------------------------------------
  socket.on("connect", () => {
    console.log(`[connected]  Socket ID: ${socket.id}`);
    console.log(`[join_ride]  Joining ride room for: ${RIDE_ID} ...`);

    socket.emit("join_ride", { ride_id: RIDE_ID }, (response) => {
      if (response && response.error) {
        console.error(`[join_ride]  ERROR: ${response.error}`);
      } else {
        console.log(`[join_ride]  Joined room: ${response ? response.room || response.status : "OK (no ack data)"}`);
        console.log("");
        console.log("Listening for events... (Ctrl+C to quit)");
        console.log("-".repeat(60));
      }
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`[disconnected]  Reason: ${reason}`);
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });

  socket.on("connect_error", (error) => {
    console.error(`[connect_error]  ${error.message}`);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`[reconnected]  After ${attemptNumber} attempt(s)`);
    socket.emit("join_ride", { ride_id: RIDE_ID }, (response) => {
      if (response && response.error) {
        console.error(`[join_ride]  Re-join ERROR: ${response.error}`);
      } else {
        console.log(`[join_ride]  Re-joined room: ${response ? response.room || response.status : "OK (no ack data)"}`);
      }
    });
  });

  socket.on("reconnect_failed", () => {
    console.error("[reconnect_failed]  Max reconnection attempts reached. Exiting.");
    process.exit(1);
  });

  // -----------------------------------------------------------------------
  // Tracking events
  // -----------------------------------------------------------------------
  socket.on("location_update", (data) => {
    const ts = data.timestamp || new Date().toISOString();
    console.log(`[location_update]  ${ts}`);
    console.log(`  Driver    : ${data.driver_id}`);
    console.log(`  Position  : ${data.latitude}, ${data.longitude}`);
    console.log(`  Heading   : ${data.heading != null ? data.heading + "°" : "n/a"}`);
    console.log(`  Speed     : ${data.speed != null ? data.speed + " km/h" : "n/a"}`);
    console.log(`  ETA       : ${data.eta_minutes != null ? Math.round(data.eta_minutes) + " min" : "n/a"}`);
    console.log(`  Remaining : ${data.distance_remaining_miles != null ? data.distance_remaining_miles + " miles" : "n/a"}`);
    console.log("");
  });

  socket.on("tracking_started", (data) => {
    console.log("[tracking_started]  Driver is on the way!");
    console.log(`  Ride ID   : ${data.ride_id}`);
    console.log(`  Driver ID : ${data.driver_id}`);
    console.log("");
  });

  socket.on("tracking_ended", (data) => {
    console.log("[tracking_ended]  Tracking session ended.");
    console.log(`  Ride ID   : ${data.ride_id}`);
    console.log(`  Reason    : ${data.reason}`);
    console.log("");
  });

  // -----------------------------------------------------------------------
  // Graceful shutdown
  // -----------------------------------------------------------------------
  function shutdown() {
    console.log("\nLeaving ride room and disconnecting...");
    socket.emit("leave_ride", { ride_id: RIDE_ID });
    socket.disconnect();
    console.log("Done.");
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
