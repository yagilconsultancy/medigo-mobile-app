import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./constants";
import { User } from "../types/auth.types";

export const storage = {
  // Token management
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  setToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error("Error setting token:", error);
    }
  },

  removeToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },

  getUser: async (): Promise<User | null> => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  setUser: async (user: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user:", error);
    }
  },

  removeUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  },

  // Refresh token
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  setRefreshToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error("Error setting refresh token:", error);
    }
  },

  // Clear all auth data
  clearAuth: async (): Promise<void> => {
    try {
      const keysToRemove = [
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.REFRESH_TOKEN,
        "user_id",
        "userPhoneNumber",
      ];

      await AsyncStorage.multiRemove(keysToRemove);
      console.log("🚀 Auth storage cleared completely");
    } catch (error) {
      console.error("❌ Error clearing auth:", error);
    }
  },

  savePhoneNumber: async (phone: string) => {
    await AsyncStorage.setItem("userPhoneNumber", phone);
  },

  getPhoneNumber: async () => {
    return await AsyncStorage.getItem("userPhoneNumber");
  },
};
