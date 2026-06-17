import Constants from "expo-constants";

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  const GOOGLE_KEY = Constants.expoConfig?.extra?.expoPublicGoogleKey;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_KEY}`
    );

    const json = await response.json();
    return json.results?.[0]?.formatted_address ?? "Unknown Location";
  } catch (e) {
    console.log("Reverse Geocoding Error:", e);
    return "Unknown Location";
  }
}
