import { create } from "zustand";

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapState {
  region: Region | null;
  setUserRegion: (lat: number, lng: number, address: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  region: null,

  setUserRegion: (lat: number, lng: number, address: string) => {
    const newRegion: Region = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };

    set({ region: newRegion });
  },
}));
