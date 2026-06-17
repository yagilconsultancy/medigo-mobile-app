import { create } from "zustand";

export interface LocationPoint {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export type TripTypeProp = "Solo trip" | "Along trip" | "Courier" | null;

interface RideStore {
  pickup: LocationPoint | null;
  destination: LocationPoint | null;
  stops: LocationPoint[];
  scheduledTrip: boolean;
  returnTrip: boolean;
  tripType: TripTypeProp;
  hasRequestedLocation: boolean;

  setHasRequestedLocation: (value: boolean) => void;
  setPickup: (point: LocationPoint) => void;
  setDestination: (point: LocationPoint) => void;
  addStop: (point: LocationPoint) => void;
  clearStops: () => void;
  setScheduledTrip: (value: boolean) => void;
  setReturnTrip: (value: boolean) => void;
  setTripType: (type: TripTypeProp) => void;
}

export const useRideStore = create<RideStore>((set) => ({
  pickup: null,
  destination: null,
  stops: [],
  scheduledTrip: false,
  returnTrip: false,
  tripType: null,
  hasRequestedLocation: false,

  setHasRequestedLocation: () => set({ hasRequestedLocation: true }),
  setPickup: (point) => set({ pickup: point }),
  setDestination: (point) => set({ destination: point }),
  addStop: (point) => set((state) => ({ stops: [...state.stops, point] })),
  clearStops: () => set({ stops: [] }),
  setScheduledTrip: (value) => set({ scheduledTrip: value }),
  setReturnTrip: (value) => set({ returnTrip: value }),
  setTripType: (value) => set({ tripType: value }),
}));
