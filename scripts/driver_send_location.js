#!/usr/bin/env node
/**
 * MediRide - Driver Location Sender
 *
 * Connects as a driver and sends simulated GPS location updates
 * to the tracking service. Broadcasts to ride room + dispatch center.
 *
 * Usage: node scripts/driver_send_location.js
 */

const { io } = require("socket.io-client");

// ---------------------------------------------------------------------------
// CONFIGURE THESE VALUES
// ---------------------------------------------------------------------------
const RIDE_ID = "17626a2b-56f9-4b12-bc7e-02dff370712b";
const DRIVER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNDY1NjcyZS1kNmRjLTRiOWQtYTFhYy1iMWY1YjM2YzhiZDciLCJyb2xlIjoiZHJpdmVyIiwiYnVzaW5lc3NfaWQiOiIyMGNmNzJmZC1kYjU4LTQ4NTUtYjM1ZC01YWMzYjFiODU1NmQiLCJlbWFpbCI6ImdhZmFyYWRldHVuamk0NzErZHJpdmVyQGdtYWlsLmNvbSIsImp0aSI6IjhhYjdmYTczLTZkNmYtNDhhMC1iOGQzLWRjNzgzMDYyZDY3YyIsImlhdCI6MTc4MDA0ODE5MCwiZXhwIjoxNzgwMDY2MTkwLCJ0eXBlIjoiYWNjZXNzIn0.LZcC5CO2oSd1__xbll3yvHhP1I0W6sZX0cHHBCVxExQ"; // Must have role: "driver"
const ENV = "staging"; // "local" or "staging"
const UPDATE_INTERVAL_MS = 5000; // Send location every 5 seconds
// ---------------------------------------------------------------------------

// Simulated route waypoints (Toronto: Union Station → Toronto General Hospital)
const ROUTE = [
  { lat: 43.6456, lng: -79.3805, heading: 45,  speed: 0 },
  { lat: 43.6460, lng: -79.3795, heading: 45,  speed: 35 },
  { lat: 43.6465, lng: -79.3788, heading: 48,  speed: 38 },
  { lat: 43.6470, lng: -79.3785, heading: 50,  speed: 40 },
  { lat: 43.6475, lng: -79.3780, heading: 52,  speed: 42 },
  { lat: 43.6480, lng: -79.3775, heading: 55,  speed: 38 },
  { lat: 43.6485, lng: -79.3770, heading: 60,  speed: 35 },
  { lat: 43.6490, lng: -79.3765, heading: 70,  speed: 30 },
  { lat: 43.6495, lng: -79.3760, heading: 80,  speed: 32 },
  { lat: 43.6500, lng: -79.3755, heading: 85,  speed: 35 },
  { lat: 43.6505, lng: -79.3750, heading: 90,  speed: 30 },
  { lat: 43.6510, lng: -79.3745, heading: 92,  speed: 28 },
  { lat: 43.6515, lng: -79.3740, heading: 95,  speed: 25 },
  { lat: 43.6520, lng: -79.3735, heading: 100, speed: 20 },
  { lat: 43.6527, lng: -79.3733, heading: 105, speed: 0 },
];

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
  console.log("  MediRide - Driver Location Sender");
  console.log("=".repeat(60));
  console.log(`  Environment : ${ENV}`);
  console.log(`  Server      : ${config.server}`);
  console.log(`  Ride ID     : ${RIDE_ID}`);
  console.log(`  Waypoints   : ${ROUTE.length}`);
  console.log(`  Interval    : ${UPDATE_INTERVAL_MS / 1000}s`);
  console.log("=".repeat(60));
  console.log("");

  const socket = io(`${config.server}/tracking`, {
    path: config.path,
    auth: { token: DRIVER_TOKEN },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  let waypointIndex = 0;
  let intervalId = null;

  // -----------------------------------------------------------------------
  // Connection lifecycle
  // -----------------------------------------------------------------------
  socket.on("connect", () => {
    console.log(`[connected]  Socket ID: ${socket.id}`);

    // Join the ride room so we can also see broadcasts
    socket.emit("join_ride", { ride_id: RIDE_ID }, (response) => {
      console.log(`[join_ride]  server ack: ${JSON.stringify(response)}`);
    });

    // Start sending location updates
    startSending();
  });

  socket.on("disconnect", (reason) => {
    console.log(`[disconnected]  Reason: ${reason}`);
    stopSending();
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });

  socket.on("connect_error", (error) => {
    console.error(`[connect_error]  ${error.message}`);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`[reconnected]  After ${attemptNumber} attempt(s)`);
    socket.emit("join_ride", { ride_id: RIDE_ID });
    startSending();
  });

  // -----------------------------------------------------------------------
  // Send location updates along the route
  // -----------------------------------------------------------------------
  function startSending() {
    if (intervalId) return; // already running

    console.log("");
    console.log("Sending location updates...");
    console.log("-".repeat(60));

    intervalId = setInterval(() => {
      if (waypointIndex >= ROUTE.length) {
        // Loop back to start
        waypointIndex = 0;
        console.log("[route]  Route complete, looping from start...");
        console.log("");
      }

      const point = ROUTE[waypointIndex];

      socket.emit(
        "update_location",
        {
          latitude: point.lat,
          longitude: point.lng,
          heading: point.heading,
          speed: point.speed,
        },
        (response) => {
          console.log(`[update_location]  server ack: ${JSON.stringify(response)}`);
          if (response && response.error) {
            console.error(`[update_location]  ERROR: ${response.error}`);
          } else if (response && response.status === "ok") {
            console.log(
              `[update_location]  ${waypointIndex}/${ROUTE.length}  ` +
              `(${point.lat}, ${point.lng})  ` +
              `heading=${point.heading}°  speed=${point.speed} km/h`
            );
          } else {
            console.warn(`[update_location]  unexpected ack (no active session?)`);
          }
        }
      );

      waypointIndex++;
    }, UPDATE_INTERVAL_MS);
  }

  function stopSending() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // -----------------------------------------------------------------------
  // Graceful shutdown
  // -----------------------------------------------------------------------
  function shutdown() {
    console.log("\nStopping location updates...");
    stopSending();
    socket.emit("leave_ride", { ride_id: RIDE_ID });
    socket.disconnect();
    console.log("Done.");
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
