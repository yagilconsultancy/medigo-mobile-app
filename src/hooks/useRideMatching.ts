import { useEffect, useState } from "react";
import { ref, onValue, getDatabase } from "firebase/database";
import { useDriverArrivalDetails } from "./useDriverArivalDetails";
import { useTripStore } from "../store/useTripStore";

// export function useRideMatching(
//   userId: string | undefined,
//   setMatchData: (data: any) => void,
// ) {
//   const db = getDatabase();
//   const [activeTripId, setActiveTripId] = useState<string | null>(null);

//   useEffect(() => {
//     if (!userId) return;

//     const currentTripRef = ref(db, `riders/${userId}/currentTrip`);

//     const unsubscribe = onValue(currentTripRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const id = snapshot.val();
//         setActiveTripId(id);
//       } else {
//         setActiveTripId(null);
//         setMatchData(null);
//       }
//     });

//     return () => unsubscribe();
//   }, [userId]);

//   useEffect(() => {
//     if (!activeTripId) return;

//     const tripDetailsRef = ref(db, `trips/${activeTripId}`);

//     const unsubscribe = onValue(tripDetailsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();

//         const enrichedData = {
//           ...data,
//           tripId: activeTripId,
//         };

//         setMatchData(enrichedData);
//       }
//     });

//     return () => unsubscribe();
//   }, [activeTripId]);
// }

export const useRideMatching = (userId: string | undefined) => {
  const initTripListener = useTripStore((s) => s.actions.initTripListener);

  useEffect(() => {
    if (!userId) return;

    // Start the global engine
    initTripListener(userId);
  }, [userId]);
};
