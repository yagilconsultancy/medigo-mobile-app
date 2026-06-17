import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Linking, Share } from "react-native";
import rideService from "../../api/services/rideService";
import {
  CancelRidePayload,
  CreateRideRequest,
  ShareRideResponse,
  UpdateRideStatusPayload,
  UpdateRideStatusResponse,
  UpdateStatusPayload,
} from "../../types/rides.types";

type UseCreateRideOptions = {
  showSuccessAlert?: boolean;
};

export const useCreateRide = (options: UseCreateRideOptions = {}) => {
  const queryClient = useQueryClient();
  const { showSuccessAlert = true } = options;

  return useMutation({
    mutationFn: (data: CreateRideRequest) => rideService.createRide(data),
    onSuccess: (response) => {
      // Invalidate existing rides list to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ["my-rides"] });

      if (showSuccessAlert) {
        Alert.alert("Success", "Your ride has been scheduled successfully!");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail?.[0]?.msg || "Failed to create ride";
      Alert.alert("Booking Error", errorMessage);
      console.error("Ride Creation Error:", error.response?.data);
    },
  });
};

interface MutationParams {
  rideId: string;
  payload: UpdateRideStatusPayload;
}

export const useUpdateRideStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateRideStatusResponse, any, MutationParams>({
    mutationFn: ({ rideId, payload }) =>
      rideService.updateRideStatus(rideId, payload),
    onSuccess: (response, variables) => {
      console.log(
        `✅ Ride ${variables.rideId} status moved to: ${variables.payload.status}`,
      );

      // Invalidate active ride data caches to trigger screen UI updates automatically
      queryClient.invalidateQueries({
        queryKey: ["active-ride", variables.rideId],
      });
      queryClient.invalidateQueries({ queryKey: ["rides-history"] });
      queryClient.invalidateQueries({ queryKey: ["rideTimeline"] });
    },
    onError: (error) => {
      console.error("❌ Failed to transition ride status:", error);

      const errorMessage =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.message ||
        "Could not update ride progress. Please check connection.";
    },
  });
};

export const useCancelRide = (rideId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CancelRidePayload) =>
      rideService.cancelRide(rideId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-rides"],
      });
    },
    onError: (error: any) => {},
  });
};

export const useShareRide = () => {
  return useMutation({
    mutationFn: (rideId: string) => rideService.shareRideLink(rideId),
    onSuccess: async (response: ShareRideResponse) => {
      const shareUrl = response?.data?.share_url;

      if (!shareUrl) {
        Alert.alert("Error", "Could not generate tracking link.");
        return;
      }

      try {
        // Triggers the iOS / Android native system share sheet
        const result = await Share.share({
          message: `Hey! You can track my ride live using this link: ${shareUrl}`,
          url: shareUrl, // Optional fallback property tailored heavily for iOS share sheets
          title: "Track My Medigo Ride", // Pre-fills the subject line for Email shares
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // Shared successfully via a specific activity type (iOS only)
            console.log(`Shared via ${result.activityType}`);
          } else {
            // Shared successfully generally
            console.log("Link shared successfully!");
          }
        } else if (result.action === Share.dismissedAction) {
          // User dismissed/canceled the share sheet tray
          console.log("Share sheet dismissed");
        }
      } catch (err: any) {
        Alert.alert(
          "Error",
          "An error occurred while opening the share option.",
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.detail?.[0]?.msg ||
        error?.response?.data?.message ||
        "Failed to generate share link. Please try again.";

      Alert.alert("Error", errorMessage);
    },
  });
};
