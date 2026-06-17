import { create } from 'zustand';

interface RouteStore {
  isVisible: boolean;
  pickup: string;
  destination: string;
  showRoute: (pickup: string, dest: string) => void;
  hideRoute: () => void;
}

export const useRouteStore = create<RouteStore>((set) => ({
  isVisible: false,
  pickup: '',
  destination: '',
  showRoute: (pickup, destination) => set({ isVisible: true, pickup, destination }),
  hideRoute: () => set({ isVisible: false }),
}));