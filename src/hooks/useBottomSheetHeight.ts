import { useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { TripBookingContext } from "../context/tripbookingContext";

export const useBottomSheetHeight = (
  points: number[],
  scrollable: boolean = false
) => {
  const { setSnapPoints, setIsScrollable } = useContext(TripBookingContext);

  useFocusEffect(
    useCallback(() => {
      setSnapPoints(points);
      setIsScrollable(scrollable);

      return () => {};
    }, [JSON.stringify(points), scrollable, setSnapPoints, setIsScrollable])
  );
};
