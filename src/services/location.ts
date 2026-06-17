import * as Location from "expo-location";

export async function requestLocationPermission(): Promise<Location.LocationObject | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("❌ Location permission denied.");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    console.log("❌ Error getting location:", error);
    return null;
  }
}
