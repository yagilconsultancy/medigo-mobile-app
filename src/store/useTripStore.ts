// import { ref, onValue, off, getDatabase } from "firebase/database";
// import { create } from "zustand";

// interface TripState {
//   currentTripId: string | null;
//   tripData: any | null;
//   status:
//     | "PAUSED"
//     | "DRIVER_EN_ROUTE"
//     | "IN_PROGRESS"
//     | "COMPLETED"
//     | "idle";
//   actions: {
//     initTripListener: (userId: string) => void;
//     clearListeners: () => void;
//   };
// }

// export const useTripStore = create<TripState>((set, get) => ({
//   currentTripId: null,
//   tripData: null,
//   status: "idle",

//   actions: {
//     initTripListener: (userId) => {
//       const db = getDatabase();
//       const riderRef = ref(db, `riders/${userId}/currentTrip`);

//       // Stage 1: Listen for Trip ID
//       onValue(riderRef, (snapshot) => {
//         const tripId = snapshot.val();

//         if (tripId) {
//           set({ currentTripId: tripId });
//           // Stage 2: Listen for Trip Updates
//           const tripRef = ref(db, `trips/${tripId}`);
//           onValue(tripRef, (tripSnap) => {
//             const data = tripSnap.val();
//             set({
//               tripData: data,
//               status: data?.status || "searching",
//             });
//           });
//         } else {
//           // Reset store if tripId is removed from Firebase
//           set({ currentTripId: null, tripData: null, status: "idle" });
//         }
//       });
//     },

//     clearListeners: () => {
//       // Logic to detach Firebase listeners
//     },
//   },
// }));

import { ref, onValue, off, DataSnapshot } from "firebase/database";
import { create } from "zustand";
import { db } from "../config/firebase";

interface TripState {
  currentTripId: string | null;
  tripData: any | null;
  status:
    | "PAUSED"
    | "DRIVER_EN_ROUTE"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "searching"
    | "idle";
  actions: {
    initTripListener: (userId: string) => void;
    clearListeners: (userId: string) => void;
  };
}

// Keep track of active Firebase references to clean them up properly
let activeRiderRef: any = null;
let activeTripRef: any = null;

export const useTripStore = create<TripState>((set, get) => ({
  currentTripId: null,
  tripData: null,
  status: "idle",

  actions: {
    initTripListener: (userId: string) => {
      if (!userId) return;

      // 1. Clean up any existing listeners before starting new ones
      get().actions.clearListeners(userId);

      activeRiderRef = ref(db, `riders/${userId}/currentTrip`);

      // Stage 1: Watch for changes to the Trip ID
      onValue(activeRiderRef, (snapshot: DataSnapshot) => {
        const tripId = snapshot.val();

        if (tripId) {
          set({ currentTripId: tripId });

          // Stage 2: Watch for changes to the Trip Data
          if (activeTripRef) off(activeTripRef); // Clean old trip listener if tripId changes

          activeTripRef = ref(db, `trips/${tripId}`);
          onValue(activeTripRef, (tripSnap: DataSnapshot) => {
            const data = tripSnap.val();
            if (data) {
              set({
                tripData: data,
                status: data.status || "searching",
              });
            }
          });
        } else {
          // No active trip
          set({ currentTripId: null, tripData: null, status: "idle" });
        }
      });
    },

    clearListeners: (userId: string) => {
      if (activeRiderRef) {
        off(activeRiderRef);
        activeRiderRef = null;
      }
      if (activeTripRef) {
        off(activeTripRef);
        activeTripRef = null;
      }
      set({ currentTripId: null, tripData: null, status: "idle" });
    },
  },
}));
