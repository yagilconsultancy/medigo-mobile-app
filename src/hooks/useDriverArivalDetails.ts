import { useEffect, useRef } from "react";
import { ref, onValue, off, getDatabase } from "firebase/database";

export function useDriverArrivalDetails(
  tripId: string | undefined,
  setMatchData: (data: any) => void,
  enabled: boolean = true,
) {
  const db = getDatabase();
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (!tripId || !enabled) return;

    const riderRef = ref(db, `trips/${tripId}`);

    const callback = (snapshot: any) => {
      if (!enabledRef.current) return;

      if (snapshot.exists()) {
        setMatchData(snapshot.val());
      } else {
        setMatchData(null);
      }
    };

    onValue(riderRef, callback);

    return () => {
      off(riderRef, "value", callback);
    };
  }, [tripId, enabled]);
}
