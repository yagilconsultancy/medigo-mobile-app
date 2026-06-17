import userService from "../api/services/userService";
import { useUserStore } from "../store/userStore";

export const syncUserProfile = async () => {
  try {
    console.log("🔄 Syncing profile starting...");

    // Use the service directly, NOT the hook
    const profileData = await userService.userProfile();

    console.log("✅ Profile Data Received:", profileData);

    // Update your Zustand store
    useUserStore.getState().setUser(profileData);

    return profileData;
  } catch (error: any) {
    // Log the actual Axios error for debugging
    console.error("❌ Sync failed:", error?.response?.data || error.message);
    return null;
  }
};
