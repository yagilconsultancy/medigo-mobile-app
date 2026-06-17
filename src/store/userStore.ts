// src/store/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfileResponse } from "../types/user.types";
import { storage } from "../utils/storage";

interface UserStore {
  user: UserProfileResponse | null;
  setUser: (user: UserProfileResponse) => void;
  updateUser: (data: Partial<UserProfileResponse>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      updateUser: (data) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...data } } : state
        ),

      logout: async () => {
        await storage.clearAuth();

        set({ user: null });

        console.log("✅ Zustand state and Storage wiped.");
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
