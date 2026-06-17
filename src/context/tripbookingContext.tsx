import { createContext } from "react";

type TripBookingContextType = {
  handleBack: () => void;
  setSnapPoints: (points: number[]) => void;
  setIsScrollable: (scrollable: boolean) => void;
};

export const TripBookingContext = createContext<TripBookingContextType>({
  handleBack: () => {},
  setSnapPoints: () => {},
  setIsScrollable: () => {},
});
