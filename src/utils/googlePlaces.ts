export interface Coordinates {
  latitude: number;
  longitude: number;
  address: string;
}

export const fetchPlaceDetails = async (
  placeId: string,
  apiKey: string
): Promise<Coordinates | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

    const res = await fetch(url);
    const json = await res.json();

    const loc = json.result?.geometry?.location;
    if (!loc) return null;

    return {
      latitude: loc.lat,
      longitude: loc.lng,
      address: json.result.formatted_address,
    };
  } catch (e) {
    console.warn("Place Details Error:", e);
    return null;
  }
};
