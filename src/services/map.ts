import * as turfHelpers from "@turf/helpers";
import turfDistance from "@turf/distance";
import polylineLib from "@mapbox/polyline";


interface LatLng {
  latitude: number;
  longitude: number;
}

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_KEY || "";

export async function fetchRoute(
  origin: LatLng,
  destination: LatLng,
  waypoints: LatLng[] = [],
): Promise<LatLng[]> {
  // If origin and destination are too close, Routes API returns nothing
  const dist = turfDistance(
    turfHelpers.point([origin.longitude, origin.latitude]),
    turfHelpers.point([destination.longitude, destination.latitude]),
    { units: "meters" },
  );
  if (dist < 50) {
    return [];
  }

  try {
    const res = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: {
                latitude: origin.latitude,
                longitude: origin.longitude,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: destination.latitude,
                longitude: destination.longitude,
              },
            },
          },
          // Stops passed in sequence order become route intermediates
          ...(waypoints.length > 0 && {
            intermediates: waypoints.map((wp) => ({
              location: {
                latLng: { latitude: wp.latitude, longitude: wp.longitude },
              },
            })),
          }),
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE",
        }),
      },
    );
    const json = await res.json();
    const encoded = json?.routes?.[0]?.polyline?.encodedPolyline;
    if (!encoded) return [];
    return polylineLib.decode(encoded).map(([lat, lng]: [number, number]) => ({
      latitude: lat,
      longitude: lng,
    }));
  } catch (e) {
    return [];
  }
}

// ── Core animation — do not change ───────────────────
// const animateToPoint = useCallback(
//   (target: LatLng) => {
//     const from = animFromRef.current;

//     if (!from) {
//       // First placement — set silently, no animation
//       animFromRef.current = target;
//       animCoord.setValue({
//         latitude: target.latitude,
//         longitude: target.longitude,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       });
//       return;
//     }

//     const dist = haversine(from, target);
//     // Hard gate: don't animate for tiny GPS noise
//     if (dist < MIN_MOVE_METERS) {
//       return;
//     }

//     const bearing = getBearing(from, target);
//     const heading = (bearing + IMAGE_OFFSET + 360) % 360;

//     let diff = heading - (rotRef.current % 360);
//     if (diff > 180) diff -= 360;
//     if (diff < -180) diff += 360;
//     const targetRot = rotRef.current + diff;
//     rotRef.current = targetRot;

//     animCoord
//       .timing({
//         latitude: target.latitude,
//         longitude: target.longitude,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//         duration: STEP_MS,
//         useNativeDriver: false,
//       })
//       .start();

//     Animated.timing(animRot, {
//       toValue: targetRot,
//       duration: STEP_MS,
//       useNativeDriver: false,
//     }).start();

//     animFromRef.current = target;
//   },
//   [animCoord, animRot],
// );

// async function fetchRoute(
//   origin: LatLng,
//   destination: LatLng,
//   waypoints: LatLng[] = [],
// ): Promise<LatLng[]> {
//   // If origin and destination are too close, Routes API returns nothing
//   const dist = turfDistance(
//     turfHelpers.point([origin.longitude, origin.latitude]),
//     turfHelpers.point([destination.longitude, destination.latitude]),
//     { units: "meters" },
//   );
//   if (dist < 50) {
//     console.log(
//       `fetchRoute: origin and destination only ${dist.toFixed(1)}m apart — skipping API call`,
//     );
//     return [];
//   }

//   try {
//     const res = await fetch(
//       "https://routes.googleapis.com/directions/v2:computeRoutes",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
//           "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
//         },
//         body: JSON.stringify({
//           origin: {
//             location: {
//               latLng: {
//                 latitude: origin.latitude,
//                 longitude: origin.longitude,
//               },
//             },
//           },
//           destination: {
//             location: {
//               latLng: {
//                 latitude: destination.latitude,
//                 longitude: destination.longitude,
//               },
//             },
//           },
//           // Stops passed in sequence order become route intermediates
//           ...(waypoints.length > 0 && {
//             intermediates: waypoints.map((wp) => ({
//               location: {
//                 latLng: { latitude: wp.latitude, longitude: wp.longitude },
//               },
//             })),
//           }),
//           travelMode: "DRIVE",
//           routingPreference: "TRAFFIC_AWARE",
//         }),
//       },
//     );
//     const json = await res.json();
//     const encoded = json?.routes?.[0]?.polyline?.encodedPolyline;
//     if (!encoded) return [];
//     return polylineLib.decode(encoded).map(([lat, lng]: [number, number]) => ({
//       latitude: lat,
//       longitude: lng,
//     }));
//   } catch (e) {
//     console.error("fetchRoute error:", e);
//     return [];
//   }
// }
