import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import * as Location from "expo-location";
import {
  View,
  StyleSheet,
  Image,
  Animated,
  ImageSourcePropType,
} from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  AnimatedRegion,
} from "react-native-maps";
import * as turfHelpers from "@turf/helpers";
import turfDistance from "@turf/distance";
import turfBearing from "@turf/bearing";
import { useTripStore } from "../../store/useTripStore";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import useTheme from "../../hooks/useThemes";
import MapPlaceholder from "./mapPlaceholder";
import ZoomControl from "./zoomControl";
import RecenterButton from "./recenterButton";
import { fetchRoute } from "../../services/map";
import { DARK_MAP_STYLE } from "../../types/map.type";

const BIKE_IMAGE = require("../../../assets/images/bikerider.png");
const CAR_IMAGE = require("../../../assets/images/carTest.png");
const ONFOOT_IMAGE = require("../../../assets/images/onfootrider.png");
const IMAGE_OFFSET = 0;
const STEP_MS = 800;
// Minimum meters the driver must move before we animate
const MIN_MOVE_METERS = 5;
const CAMERA_PADDING = { top: 100, right: 60, bottom: 220, left: 60 };

interface LatLng {
  latitude: number;
  longitude: number;
}
interface Props {
  bottomOffset?: number;
  onArrival?: () => void;
  pickup?: LatLng | null;
  destination?: LatLng | null;
  driverLocation?:
    | (LatLng & { heading?: number | null; speed?: number | null })
    | null;
  rideStatus?: string | null;
  tripData?: any | null;
}

const haversine = (a: LatLng, b: LatLng) =>
  turfDistance(
    turfHelpers.point([a.longitude, a.latitude]),
    turfHelpers.point([b.longitude, b.latitude]),
    { units: "meters" },
  );

const getBearing = (a: LatLng, b: LatLng) => {
  const b_ = turfBearing(
    turfHelpers.point([a.longitude, a.latitude]),
    turfHelpers.point([b.longitude, b.latitude]),
  );
  return (b_ + 360) % 360;
};

const MapScreen: React.FC<Props> = ({
  bottomOffset = 200,
  onArrival,
  pickup,
  destination,
  driverLocation,
  rideStatus,
  tripData,
}) => {
  const { theme, colors } = useTheme();
  const isDark = theme !== "light";
  const mapStyle = isDark ? DARK_MAP_STYLE : undefined;
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  // const tripData = useTripStore((s) => s.tripData);
  const storeStatus = useTripStore((s) => s.status);
  const status = rideStatus ?? storeStatus;
  const normalizedStatus = status?.toLowerCase();
  const [isFollowing, setIsFollowing] = useState(false);

  // Read primitive values directly — avoids object recreation on every render
  const realDriverLat =
    driverLocation?.latitude ??
    tripData?.driverCurrentLocation?.latitude ??
    null;
  const realDriverLng =
    driverLocation?.longitude ??
    tripData?.driverCurrentLocation?.longitude ??
    null;

  const deliveryTypeImages: Record<string, ImageSourcePropType> = {
    CAR: CAR_IMAGE,
    BIKE: BIKE_IMAGE,
    ON_FOOT: ONFOOT_IMAGE,
  };

  const imageSource = deliveryTypeImages[tripData?.deliveryType] || CAR_IMAGE;

  const [isMocking, setIsMocking] = useState(false);
  const [mockCoord, setMockCoord] = useState<LatLng | null>(null);
  const mockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const driverLat = isMocking
    ? (mockCoord?.latitude ?? realDriverLat)
    : realDriverLat;
  const driverLng = isMocking
    ? (mockCoord?.longitude ?? realDriverLng)
    : realDriverLng;

  // tripData coords take priority; fall back to props passed from the booking screen

  const pickupLat = tripData?.pickup?.lat ?? pickup?.latitude ?? null;
  const pickupLng = tripData?.pickup?.lng ?? pickup?.longitude ?? null;
  const dropoffLat = tripData?.dropoff?.lat ?? destination?.latitude ?? null;
  const dropoffLng = tripData?.dropoff?.lng ?? destination?.longitude ?? null;

  const mapRef = useRef<MapView>(null);
  const animFromRef = useRef<LatLng | null>(null);
  const rotRef = useRef(0);
  const routeFetchedRef = useRef<string | null>(null); // tracks which status we last fetched for
  const routeRef = useRef<LatLng[]>([]); // master copy — never trimmed in place
  const trimIndexRef = useRef(0);
  const [zoomLevel, setZoomLevel] = useState(14);
  const MAX_ZOOM = 20;
  const MIN_ZOOM = 3;

  // Add these new refs
  const lastUpdateTimeRef = useRef<number>(0);
  const lastPositionRef = useRef<LatLng | null>(null);
  const animationFrameRef = useRef<number>(0); // consumed index into routeRef
  // Add these refs for rerouting
  const isReroutingRef = useRef<boolean>(false);
  const deviationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [route, setRoute] = useState<LatLng[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [carLoaded, setCarLoaded] = useState(false);

  // ── Mocking logic ──
  useEffect(() => {
    if (isMocking) {
      // Start moving along the routeRef from current trim index
      let currentIndex = trimIndexRef.current;

      // Set immediately on play
      if (
        routeRef.current &&
        routeRef.current.length > 0 &&
        currentIndex < routeRef.current.length
      ) {
        setMockCoord(routeRef.current[currentIndex]);
      }

      mockIntervalRef.current = setInterval(() => {
        if (
          routeRef.current &&
          routeRef.current.length > 0 &&
          currentIndex < routeRef.current.length
        ) {
          currentIndex += 2; // move 2 points at a time for noticeable speed
          if (currentIndex < routeRef.current.length) {
            setMockCoord(routeRef.current[currentIndex]);
          } else {
            // Reached end of route
            setIsMocking(false);
          }
        } else {
          // Reached end of route or no route
          setIsMocking(false);
        }
      }, 1000); // update every 1 second
    } else {
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
      setMockCoord(null);
    }
    return () => {
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
    };
  }, [isMocking]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTracksViewChanges(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Check if driver has deviated from route and needs rerouting
  const checkForRerouting = useCallback((driverPos: LatLng) => {
    const route = routeRef.current;
    if (route.length < 2) return false;

    // Find closest point on current route
    let closestDist = Infinity;
    let closestIdx = trimIndexRef.current;
    const searchStart = Math.max(0, trimIndexRef.current);
    const searchEnd = Math.min(route.length - 1, trimIndexRef.current + 20);

    for (let i = searchStart; i <= searchEnd; i++) {
      const dist = haversine(driverPos, route[i]);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }

    // If closest point is too far AND we're not already rerouting, trigger reroute
    const DEVIATION_THRESHOLD = 50; // meters
    if (closestDist > DEVIATION_THRESHOLD && !isReroutingRef.current) {
      console.log(`Deviation detected: ${closestDist.toFixed(1)}m from route`);
      return true;
    }

    return false;
  }, []);

  const getActiveDestination = useCallback(() => {
    if (
      normalizedStatus === "driver_en_route" &&
      pickupLat != null &&
      pickupLng != null
    ) {
      return { latitude: pickupLat, longitude: pickupLng };
    }

    if (dropoffLat != null && dropoffLng != null) {
      return { latitude: dropoffLat, longitude: dropoffLng };
    }

    if (pickupLat != null && pickupLng != null) {
      return { latitude: pickupLat, longitude: pickupLng };
    }

    return null;
  }, [dropoffLat, dropoffLng, normalizedStatus, pickupLat, pickupLng]);

  // Fetch updated route from current position to destination
  const reroute = useCallback(
    async (currentPos: LatLng) => {
      if (isReroutingRef.current) return;

      const dest = getActiveDestination();

      if (!dest) return;

      isReroutingRef.current = true;
      console.log("Rerouting from current position...");

      try {
        // Fetch new route from current position to destination
        const newRoute = await fetchRoute(currentPos, dest);

        if (newRoute.length > 0) {
          // Reset route tracking with new route
          routeRef.current = newRoute;
          trimIndexRef.current = 0;
          setRoute(newRoute);

          // DO NOT call fitToCoordinates here.
          // fitToCoordinates calculates a bounding box for the entire route and zooms out to fit it.
          // During active navigation, we want to maintain the user's zoom level.
          // console.log("Rerouting successful - new route loaded");
        }
      } catch (error) {
        console.error("Rerouting failed:", error);
      } finally {
        isReroutingRef.current = false;
      }
    },
    [getActiveDestination],
  );

  // ── Get device location on mount as initial map position ─────
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") return;
  //     const pos = await Location.getCurrentPositionAsync({
  //       accuracy: Location.Accuracy.Balanced,
  //     });
  //     setUserLocation({
  //       latitude: pos.coords.latitude,
  //       longitude: pos.coords.longitude,
  //     });
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      // 1. Instant cached location
      const lastKnown = await Location.getLastKnownPositionAsync();

      if (lastKnown) {
        setUserLocation({
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        });
      }

      // 2. Fresh accurate location
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    })();
  }, []);

  // Prefer real driver coords; fall back to device GPS; last resort null
  const displayLat = driverLat ?? userLocation?.latitude ?? null;
  const displayLng = driverLng ?? userLocation?.longitude ?? null;
  const applyRoute = useCallback((points: LatLng[]) => {
    routeRef.current = points;
    trimIndexRef.current = 0;
    setRoute(points);
  }, []);
  // ── Pre-trip preview: show route between prop pickup & destination ─
  // Only runs while there is no active trip (status is null / falsy)
  // and the map is ready. When tripData arrives the status-effects take over.
  useEffect(() => {
    if (!mapReady) return;
    // Only skip when a real trip phase is active — "idle" / "searching" mean no driver yet
    const tripActive =
      (driverLat != null && driverLng != null) ||
      normalizedStatus === "driver_en_route" ||
      normalizedStatus === "in_progress" ||
      normalizedStatus === "arrived_at_pickup" ||
      normalizedStatus === "driver_arrived" ||
      normalizedStatus === "arrived_at_stop";
    if (tripActive) return;
    if (!pickup || !destination) {
      // If props are cleared, clear the preview route too
      setRoute([]);
      return;
    }

    const origin: LatLng = {
      latitude: pickup.latitude,
      longitude: pickup.longitude,
    };
    const dest: LatLng = {
      latitude: destination.latitude,
      longitude: destination.longitude,
    };

    applyRoute([]);
    fetchRoute(origin, dest).then((points) => {
      if (points.length) {
        applyRoute(points);
        // Fit to show the full route including stops, pickup and destination
        const allCoords = [origin, dest, ...points];
        mapRef.current?.fitToCoordinates(allCoords, {
          edgePadding: CAMERA_PADDING,
          animated: true,
        });
      } else {
        applyRoute([origin, dest]);
        // Fallback: still fit map to show both pins even without a polyline
        mapRef.current?.fitToCoordinates([origin, dest], {
          edgePadding: CAMERA_PADDING,
          animated: true,
        });
      }
    });
  }, [
    pickup?.latitude,
    pickup?.longitude,
    destination?.latitude,
    destination?.longitude,
    driverLat,
    driverLng,
    mapReady,
    normalizedStatus,
    applyRoute,
  ]);

  // ── Animated values — do not change ──────────────────
  const animCoord = useRef(
    new AnimatedRegion({
      latitude: displayLat ?? 0,
      longitude: displayLng ?? 0,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }),
  ).current;

  const animRot = useRef(new Animated.Value(0)).current;

  const spin = animRot.interpolate({
    inputRange: [-3600, 3600],
    outputRange: ["-3600deg", "3600deg"],
    extrapolate: "clamp",
  });

  // ── Route helpers ─────────────────────────────────────
  // Always use applyRoute instead of setRoute directly — keeps routeRef in sync.

  // Call on every real driver move to consume already-passed polyline points.
  const trimPolyline = useCallback((driverPos: LatLng) => {
    const full = routeRef.current;
    if (full.length < 2) return;

    let bestIdx = trimIndexRef.current;
    let bestDist = Infinity;

    const searchStart = Math.max(0, trimIndexRef.current);
    const searchEnd = Math.min(full.length - 1, trimIndexRef.current + 50);

    for (let i = searchStart; i <= searchEnd; i++) {
      const dist = haversine(driverPos, full[i]);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    if (bestIdx >= trimIndexRef.current) {
      trimIndexRef.current = bestIdx;

      const remainingPoints = full.slice(bestIdx);

      if (remainingPoints.length >= 1) {
        // Premium feel: explicitly anchor the start of the polyline to the
        // driver's exact current position. This prevents the line from trailing
        // behind the car, and stops any gaps from forming in front of it.
        setRoute([driverPos, ...remainingPoints]);
      } else {
        setRoute(full.slice(-2));
      }
    }
  }, []);

  // Calculate predicted position based on speed and bearing
  const predictPosition = useCallback(
    (current: LatLng, target: LatLng, timeDelta: number): LatLng => {
      const distance = haversine(current, target);
      const speed = distance / Math.max(STEP_MS / 1000, 0.1);
      const bearing = getBearing(current, target);
      const predictedDistance = speed * (timeDelta / 1000);
      const finalDistance = Math.min(predictedDistance, distance);
      const ratio = finalDistance / Math.max(distance, 0.001);

      return {
        latitude:
          current.latitude + (target.latitude - current.latitude) * ratio,
        longitude:
          current.longitude + (target.longitude - current.longitude) * ratio,
      };
    },
    [],
  );

  // Interpolate between route points for smoother car movement
  const interpolateRoutePosition = useCallback(
    (routePoints: LatLng[], progress: number): LatLng => {
      if (routePoints.length < 2) return routePoints[0];

      const totalSegments = routePoints.length - 1;
      const segmentProgress = progress * totalSegments;
      const segmentIndex = Math.floor(segmentProgress);
      const segmentT = segmentProgress - segmentIndex;

      if (segmentIndex >= routePoints.length - 1) {
        return routePoints[routePoints.length - 1];
      }

      const p0 = routePoints[Math.max(0, segmentIndex - 1)];
      const p1 = routePoints[segmentIndex];
      const p2 =
        routePoints[Math.min(routePoints.length - 1, segmentIndex + 1)];
      const p3 =
        routePoints[Math.min(routePoints.length - 1, segmentIndex + 2)];

      const t = segmentT;
      const t2 = t * t;
      const t3 = t2 * t;

      const latitude =
        0.5 *
        (2 * p1.latitude +
          (-p0.latitude + p2.latitude) * t +
          (2 * p0.latitude - 5 * p1.latitude + 4 * p2.latitude - p3.latitude) *
            t2 +
          (-p0.latitude + 3 * p1.latitude - 3 * p2.latitude + p3.latitude) *
            t3);

      const longitude =
        0.5 *
        (2 * p1.longitude +
          (-p0.longitude + p2.longitude) * t +
          (2 * p0.longitude -
            5 * p1.longitude +
            4 * p2.longitude -
            p3.longitude) *
            t2 +
          (-p0.longitude + 3 * p1.longitude - 3 * p2.longitude + p3.longitude) *
            t3);

      return { latitude, longitude };
    },
    [],
  );

  const animateToPoint = useCallback(
    (target: LatLng, timestamp?: number) => {
      const now = timestamp || Date.now();
      const from = animFromRef.current;
      const lastUpdate = lastUpdateTimeRef.current;
      const lastPos = lastPositionRef.current;

      if (!from) {
        // First placement
        animFromRef.current = target;
        lastPositionRef.current = target;
        lastUpdateTimeRef.current = now;
        animCoord.setValue({
          latitude: target.latitude,
          longitude: target.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        return;
      }

      const dist = haversine(from, target);

      if (dist < MIN_MOVE_METERS) {
        return;
      }

      let animatedTarget = target;
      if (lastPos && lastUpdate && now - lastUpdate < 2000) {
        const timeSinceLastUpdate = now - lastUpdate;
        const predicted = predictPosition(lastPos, target, timeSinceLastUpdate);
        const blendFactor = Math.min(0.7, timeSinceLastUpdate / 1000);
        animatedTarget = {
          latitude:
            predicted.latitude * blendFactor +
            target.latitude * (1 - blendFactor),
          longitude:
            predicted.longitude * blendFactor +
            target.longitude * (1 - blendFactor),
        };
      }

      const bearing = getBearing(from, animatedTarget);
      const heading = (bearing + IMAGE_OFFSET + 360) % 360;

      let diff = heading - (rotRef.current % 360);
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const targetRot = rotRef.current + diff;
      rotRef.current = targetRot;

      lastPositionRef.current = animatedTarget;
      lastUpdateTimeRef.current = now;

      (animCoord as any)
        .timing({
          latitude: animatedTarget.latitude,
          longitude: animatedTarget.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
          duration: STEP_MS,
          useNativeDriver: false,
        })
        .start();

      Animated.timing(animRot, {
        toValue: targetRot,
        duration: STEP_MS,
        useNativeDriver: false,
      }).start();

      animFromRef.current = animatedTarget;
    },
    [animCoord, animRot, predictPosition],
  );

  // ── Fetch route once per status ───────────────────────
  useEffect(() => {
    if (!mapReady) return;
    // Re-fetch when status OR stop count changes (stops may arrive after status is set)
    const cacheKey = `${normalizedStatus ?? "driver_live"}`;

    if (normalizedStatus === "driver_en_route") {
      if (
        driverLat == null ||
        driverLng == null ||
        pickupLat == null ||
        pickupLng == null
      )
        return;
      if (routeFetchedRef.current === cacheKey) return;
      routeFetchedRef.current = cacheKey;

      const origin = { latitude: driverLat, longitude: driverLng };
      const dest = { latitude: pickupLat, longitude: pickupLng };

      // Place car immediately at driver position
      animFromRef.current = null;
      animateToPoint(origin);

      applyRoute([]);
      fetchRoute(origin, dest).then((points) => {
        if (points.length) {
          applyRoute(points);
          mapRef.current?.fitToCoordinates([origin, dest, ...points], {
            edgePadding: CAMERA_PADDING,
            animated: true,
          });
        } else {
          applyRoute([origin, dest]);
          // Still fit map to show both driver + pickup even without polyline
          mapRef.current?.fitToCoordinates([origin, dest], {
            edgePadding: CAMERA_PADDING,
            animated: true,
          });
        }
      });
    }

    // Driver has arrived at pickup — show the onward route including stops
    if (
      normalizedStatus === "arrived_at_pickup" ||
      normalizedStatus === "driver_arrived"
    ) {
      if (
        driverLat == null ||
        driverLng == null ||
        dropoffLat == null ||
        dropoffLng == null
      )
        return;
      if (routeFetchedRef.current === cacheKey) return;
      routeFetchedRef.current = cacheKey;

      const origin = { latitude: driverLat, longitude: driverLng };
      const dest = { latitude: dropoffLat, longitude: dropoffLng };

      animFromRef.current = null;
      animateToPoint(origin);

      applyRoute([]);
      fetchRoute(origin, dest).then((points) => {
        if (points.length) {
          applyRoute(points);
          mapRef.current?.fitToCoordinates([origin, dest, ...points], {
            edgePadding: CAMERA_PADDING,
            animated: true,
          });
        } else {
          applyRoute([origin, dest]);
          mapRef.current?.fitToCoordinates([origin, dest], {
            edgePadding: CAMERA_PADDING,
            animated: true,
          });
        }
      });
    }

    if (normalizedStatus === "in_progress") {
      if (
        driverLat == null ||
        driverLng == null ||
        dropoffLat == null ||
        dropoffLng == null
      )
        return;
      if (routeFetchedRef.current === cacheKey) return;
      routeFetchedRef.current = cacheKey;

      // Use driver's live position as origin — more accurate than the static pickup point
      const origin = { latitude: driverLat, longitude: driverLng };
      const dest = { latitude: dropoffLat, longitude: dropoffLng };

      animFromRef.current = null;
      animateToPoint(origin);

      applyRoute([]);
      fetchRoute(origin, dest).then((points) => {
        if (points.length) {
          applyRoute(points);
          mapRef.current?.fitToCoordinates([origin, dest, ...points], {
            edgePadding: CAMERA_PADDING,
            animated: true,
          });
        } else {
          applyRoute([origin, dest]);
          mapRef.current?.fitToCoordinates([origin, dest], {
            edgePadding: CAMERA_PADDING,
            animated: true,
          });
        }
      });
    }

    if (
      normalizedStatus !== "driver_en_route" &&
      normalizedStatus !== "arrived_at_pickup" &&
      normalizedStatus !== "driver_arrived" &&
      normalizedStatus !== "in_progress"
    ) {
      if (driverLat == null || driverLng == null) return;
      const dest = getActiveDestination();
      if (!dest) return;
      const fallbackCacheKey = `driver_live:${driverLat.toFixed(4)}:${driverLng.toFixed(4)}:${dest.latitude.toFixed(4)}:${dest.longitude.toFixed(4)}`;
      if (routeFetchedRef.current === fallbackCacheKey) return;
      routeFetchedRef.current = fallbackCacheKey;

      const origin = { latitude: driverLat, longitude: driverLng };

      animFromRef.current = null;
      animateToPoint(origin);

      applyRoute([]);
      fetchRoute(origin, dest).then((points) => {
        if (points.length) {
          applyRoute(points);
          mapRef.current?.fitToCoordinates([origin, dest, ...points], {
            edgePadding: CAMERA_PADDING,
            animated: true,
          });
        } else {
          applyRoute([origin, dest]);
          mapRef.current?.fitToCoordinates([origin, dest], {
            edgePadding: CAMERA_PADDING,
            animated: true,
          });
        }
      });
    }
  }, [
    normalizedStatus,
    mapReady,
    applyRoute,
    animateToPoint,
    driverLat,
    driverLng,
    pickupLat,
    pickupLng,
    dropoffLat,
    dropoffLng,
    getActiveDestination,
  ]);

  // Refresh route when approaching stops or destination
  useEffect(() => {
    if (!mapReady) return;
    if (!routeRef.current.length) return;
    if (isReroutingRef.current) return;

    // Check if we're near a stop and need to refresh route
    const checkProximityAndRefresh = async () => {
      if (!animFromRef.current) return;

      // Check distance to next significant point
      const nextPointIndex = trimIndexRef.current + 5; // Look ahead 5 points
      if (nextPointIndex < routeRef.current.length) {
        const nextPoint = routeRef.current[nextPointIndex];
        const distance = haversine(animFromRef.current, nextPoint);

        // If we're getting close but route seems stale, refresh
        if (distance < 100 && distance > 20) {
          const currentPos = animFromRef.current;
          const dest = getActiveDestination();

          if (dest) {
            const freshRoute = await fetchRoute(currentPos, dest);
            if (
              freshRoute.length > 0 &&
              freshRoute.length !== routeRef.current.length
            ) {
              console.log("Route refreshed - updated polyline");
              routeRef.current = freshRoute;
              trimIndexRef.current = 0;
              setRoute(freshRoute);
            }
          }
        }
      }
    };

    const interval = setInterval(checkProximityAndRefresh, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [mapReady, getActiveDestination, animFromRef.current]);

  // ── Animate car ONLY on real driver movement ──────────
  // Deps are primitives — this effect only fires when the actual
  // number changes, not when a new object is created.
  useEffect(() => {
    if (driverLat == null || driverLng == null) return;

    const target = { latitude: driverLat, longitude: driverLng };

    const prev = animFromRef.current;
    if (prev && haversine(prev, target) < MIN_MOVE_METERS) return;

    // Check if rerouting is needed
    if (routeRef.current.length > 0 && !isReroutingRef.current) {
      const needsReroute = checkForRerouting(target);
      if (needsReroute) {
        // Debounce rerouting to avoid multiple rapid calls
        if (deviationTimeoutRef.current) {
          clearTimeout(deviationTimeoutRef.current);
        }
        deviationTimeoutRef.current = setTimeout(() => {
          reroute(target);
        }, 2000); // Wait 2 seconds to confirm deviation is persistent
        return; // Don't animate until rerouting completes
      }
    }

    animateToPoint(target);
    trimPolyline(target);

    // Auto-fit camera
    // if (routeRef.current.length > 0 && trimIndexRef.current < routeRef.current.length) {
    //   const remainingRoute = routeRef.current.slice(trimIndexRef.current);
    //   if (remainingRoute.length > 0) {
    //     const pointsToShow = [target, ...remainingRoute.slice(0, 5)];
    //     mapRef.current?.fitToCoordinates(pointsToShow, {
    //       edgePadding: CAMERA_PADDING,
    //       animated: true,
    //     });
    //   }
    // }

    // Smoothly pan to keep the car centered ONLY if the user is following (recenter mode)
    if (isFollowing) {
      mapRef.current?.getCamera().then((cam) => {
        mapRef.current?.animateCamera(
          {
            center: target,
            zoom: cam.zoom, // explicitly preserve current zoom to avoid Android resetting it
          },
          { duration: 1000 },
        );
      });
    }
  }, [
    driverLat,
    driverLng,
    normalizedStatus,
    trimPolyline,
    animateToPoint,
    checkForRerouting,
    reroute,
    isFollowing,
    isMocking,
  ]);

  useEffect(() => {
    if (driverLat == null || driverLng == null) {
      return;
    }

    setIsFollowing(true);
  }, [driverLat, driverLng]);

  const handleRecenter = useCallback(() => {
    setIsFollowing(true);

    // Find what to center on (prioritize driver, fallback to user location)
    const targetLat = driverLat ?? userLocation?.latitude;
    const targetLng = driverLng ?? userLocation?.longitude;

    if (targetLat != null && targetLng != null) {
      mapRef.current?.animateCamera(
        {
          center: { latitude: targetLat, longitude: targetLng },
          zoom: 17, // Zoom in to a nice navigation level
        },
        { duration: 1000 },
      );
    }
  }, [driverLat, driverLng, userLocation]);
  const handlePanDrag = useCallback(() => setIsFollowing(false), []);

  const handleZoom = (zoomIn: boolean) => {
    mapRef.current?.getCamera().then((cam) => {
      const newZoom = zoomIn
        ? Math.min(zoomLevel + 1, MAX_ZOOM)
        : Math.max(zoomLevel - 1, MIN_ZOOM);

      setZoomLevel(newZoom); // Update local state (optional)

      mapRef.current?.animateCamera(
        {
          zoom: newZoom,
          // optional: keep center same or recenter
          center: { latitude: displayLat, longitude: displayLng },
        },
        { duration: 300 },
      );
    });
  };

  // Add cleanup at the bottom of your component, right before the return statement
  useEffect(() => {
    return () => {
      if (deviationTimeoutRef.current) {
        clearTimeout(deviationTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (displayLat == null || displayLng == null) {
    return <MapPlaceholder />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={mapStyle}
        showsCompass={false}
        rotateEnabled={false}
        pitchEnabled={false}
        mapPadding={{ top: 50, right: 20, bottom: bottomOffset + 20, left: 20 }}
        initialRegion={{
          latitude: displayLat,
          longitude: displayLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onMapReady={() => setMapReady(true)}
        showsUserLocation={false}
        showsMyLocationButton={false}
        onPanDrag={handlePanDrag}
        zoomEnabled={true}
        zoomTapEnabled={true}
        moveOnMarkerPress={false}
        toolbarEnabled={false}
        loadingEnabled={true}
      >
        {/* Polyline */}
        {route.length > 0 && (
          <>
            <Polyline
              coordinates={route}
              strokeColor="rgba(0,0,0,0.2)"
              strokeWidth={8}
              lineJoin="round"
              lineCap="round"
              zIndex={1}
            />
            <Polyline
              coordinates={route}
              strokeColor={
                normalizedStatus === "driver_en_route"
                  ? isDark
                    ? "#FFFFFF"
                    : "#000000"
                  : "#17B42F"
              }
              strokeWidth={6}
              lineJoin="round"
              lineCap="round"
              zIndex={2}
            />
          </>
        )}

        {/* Pickup marker */}
        {pickupLat != null && pickupLng != null && (
          <Marker
            coordinate={{ latitude: pickupLat, longitude: pickupLng }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={5}
            tracksViewChanges={tracksViewChanges}
          >
            <Svg width="44" height="44" viewBox="0 0 24 24">
              <Path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="rgba(0,0,0,0.2)"
                transform="translate(0, 1)"
              />
              <Path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="#17B42F"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <Circle cx="12" cy="9" r="3.5" fill="#FFFFFF" />
            </Svg>
          </Marker>
        )}

        {/* Dropoff marker */}
        {dropoffLat != null &&
          dropoffLng != null &&
          normalizedStatus !== "driver_en_route" && (
            <Marker
              coordinate={{ latitude: dropoffLat, longitude: dropoffLng }}
              anchor={{ x: 0.5, y: 1 }}
              zIndex={5}
              tracksViewChanges={tracksViewChanges}
            >
              <Svg width="44" height="44" viewBox="0 0 24 24">
                <Defs>
                  <LinearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FF3B30" />
                    <Stop offset="100%" stopColor="#FF3B30" />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  fill="rgba(0,0,0,0.15)"
                  transform="translate(1, 2)"
                />
                <Path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  fill="url(#redGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <Circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
              </Svg>
            </Marker>
          )}

        {/* User location marker — only when real device GPS available */}
        {!driverLat && !driverLng && userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={6}
            tracksViewChanges={tracksViewChanges}
            accessibilityLabel="User location"
          >
            {/* small blue dot with subtle glow */}
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 20,
                backgroundColor: "rgba(59, 130, 246, 0.95)",
                borderWidth: 2,
                borderColor: "#fff",
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.7,
                shadowRadius: 4,
                elevation: 4,
              }}
            />
          </Marker>
        )}

        {/* Car — only rendered once driver coords arrive */}
        {driverLat != null && driverLng != null && (
          <Marker.Animated
            coordinate={animCoord as any}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
            rotation={animRot as any}
            tracksViewChanges={!carLoaded}
            zIndex={10}
            accessibilityLabel="Driver vehicle location"
            accessibilityRole="image"
          >
            <Image
              source={imageSource}
              style={{ width: 45, height: 45, resizeMode: "contain" }}
              fadeDuration={0}
              onLoad={() => setCarLoaded(true)}
            />
          </Marker.Animated>
        )}

        {/* ── Stops Markers ───────────────────────────────── */}
      </MapView>

      {/* ── Mock Controls ─────────────────────────────── */}
      {/* <TouchableOpacity
        style={[
          styles.recenterButton,
          {
            bottom: bottomOffset + 100, // placed above the recenter button
            backgroundColor: isDark ? "#2C2C2C" : "#FFFFFF",
          },
        ]}
        onPress={() => setIsMocking(!isMocking)}
        activeOpacity={0.8}
      >
        <MaterialIcons
          name={isMocking ? "stop" : "play-arrow"}
          size={24}
          color={isMocking ? "#e74c3c" : "#2ecc71"}
        />
      </TouchableOpacity> */}

      {tripData && (
        <ZoomControl
          handleZoom={handleZoom}
          zoomLevel={zoomLevel}
          MAX_ZOOM={MAX_ZOOM}
          MIN_ZOOM={MIN_ZOOM}
        />
      )}

      {/* ── Recenter Button ─────────────────────────────── */}

      <RecenterButton
        bottomOffset={bottomOffset}
        isDark={isDark}
        handleRecenter={handleRecenter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  // Stop markers
  stopMarkerContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  stopMarkerText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  recenterButton: {
    position: "absolute",
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  customZoomControls: {
    position: "absolute",
    top: 60, // ⭐ Adjust these values
    right: 30, // ⭐ to position anywhere
    gap: 10,
  },
  zoomButton: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  zoomText: { fontSize: 24, fontWeight: "bold" },
});

export default MapScreen;
