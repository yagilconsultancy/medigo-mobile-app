import axios from "axios";
import { API_CONFIG } from "./constants";
import { storage } from "./storage";
import { useUserStore } from "../store/userStore";
import { queryClient } from "../providers/queryProvider";

/**
 * One place that ends a session.
 *
 * - Tells the server to revoke the refresh token (best effort; a failed call
 *   never blocks the sign-out).
 * - Clears every cached query so the next person on this phone cannot see the
 *   previous person's rides, contacts or locations.
 * - Wipes stored tokens and the persisted user.
 */
export async function signOut(options: { callServer?: boolean } = {}) {
  const { callServer = true } = options;

  if (callServer) {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        storage.getToken(),
        storage.getRefreshToken(),
      ]);

      if (accessToken && refreshToken) {
        await axios.post(
          `${API_CONFIG.BASE_URL}/auth/logout`,
          { refresh_token: refreshToken },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            timeout: 5000,
          },
        );
      }
    } catch (error) {
      // Offline or already expired: the local sign-out below still happens.
      console.warn("Server logout skipped:", (error as Error)?.message);
    }
  }

  // Stop any screen data still loading, then wipe the cache.
  await queryClient.cancelQueries();
  queryClient.clear();
  await useUserStore.getState().logout();
}
