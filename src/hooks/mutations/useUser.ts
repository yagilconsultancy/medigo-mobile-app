import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateProfilePayload,
} from "../../types/auth.types";
import userService from "../../api/services/userService";
import {
  CreateEmergencyContactRequest,
  CreateLocationPayload,
  UpdateConsentPayload,
  UpdateDriverPayload,
  UpdateLocationRequest,
  UpdateNotificationsPayload,
  UpdatePrivacyPayload,
  UpdateStatusPayload,
  UpdateVehiclePayload,
  UserProfileResponse,
} from "../../types/user.types";
import { Alert } from "react-native";
import { useUserStore } from "../../store/userStore";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      userService.updateProfile(payload),
    onSuccess: (data) => {
      // Invalidate the 'user-profile' query to refresh data across the app
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      console.log("Profile updated successfully");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.detail?.[0]?.msg || "Failed to update profile";
      console.error("Update Error:", errorMsg);
    },
  });
};

export const useUpdateConsentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateConsentPayload) =>
      userService.updateConsent(payload),
    onSuccess: (data) => {
      // Refresh user profile to reflect that onboarding/consent is complete
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      console.log("Consents updated successfully");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.detail?.[0]?.msg || "Failed to update consent";
      console.error("Consent Error:", errorMsg);
    },
  });
};

export const useCreateLocationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLocationPayload) =>
      userService.createSavedLocation(payload),
    onSuccess: (data) => {
      // Invalidate the list query to trigger a background refetch
      queryClient.invalidateQueries({ queryKey: ["saved-locations"] });
      console.log("Location saved:", data.message);
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.detail?.[0]?.msg || "Failed to save location";
      console.error("Save Location Error:", errorMsg);
    },
  });
};

interface MutationParams {
  locationId: string;
  data: UpdateLocationRequest;
  showAlert?: boolean;
}

export const useUpdateSavedLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ locationId, data }: MutationParams) =>
      userService.updateSavedLocation(locationId, data),
    onSuccess: (response, variables) => {
      // Refresh the list of saved locations immediately
      queryClient.invalidateQueries({ queryKey: ["saved-locations"] });
      queryClient.invalidateQueries({
        queryKey: ["saved-locations", variables.locationId],
      });
      if (variables.showAlert !== false) {
        Alert.alert("Success", "Location updated successfully");
      }
    },
    onError: (error: any) => {},
  });
};

export const useDeleteSavedLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (locationId: string) =>
      userService.deleteSavedLocation(locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-locations"] });
      Alert.alert("Deleted", "Location removed from your saved list.");
    },
    onError: (error: any) => {},
  });
};

export const useCreateEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmergencyContactRequest) =>
      userService.createEmergencyContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-contacts"] });
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.detail?.[0]?.msg || "Failed to save contact";
      Alert.alert("Error", msg);
    },
  });
};

export const useDeleteEmergencyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) =>
      userService.deleteEmergencyContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-contacts"] });
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.detail?.[0]?.msg || "Could not delete contact";
      Alert.alert("Error", msg);
    },
  });
};

export const useUpdateDriverStatus = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: (payload: UpdateStatusPayload) =>
      userService.toggleOnlineStatus(payload),
    onSuccess: (response) => {
      // 1. Update the local store so the UI reflects the change immediately
      // Assuming your store structure has a data object
      const currentState = useUserStore.getState().user;
      if (currentState) {
        setUser({
          ...currentState,
          data: {
            ...currentState.data,
            is_active: response.data.is_online, // Mapping is_online to your local is_active
          },
        });
      }

      // 2. Refresh other data that depends on being online
      queryClient.invalidateQueries({ queryKey: ["earnings-summary"] });
    },
    onError: (error: any) => {},
  });
};

export const useUpdateDriverProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDriverPayload) =>
      userService.updateDriverProfile(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useUpdateDriverVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateVehiclePayload) =>
      userService.updateVehicleDetails(payload),
    onSuccess: (response) => {
      // Refresh all vehicle-related data across the app
      queryClient.invalidateQueries({ queryKey: ["driver-vehicle"] });
      queryClient.invalidateQueries({ queryKey: ["driver-profile-me"] });
    },
    onError: (error: any) => {},
  });
};

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNotificationsPayload) =>
      userService.updateNotifications(payload),
    onSuccess: () => {
      // Refresh the settings cache so the UI reflects the new state
      queryClient.invalidateQueries({ queryKey: ["driver-settings"] });
    },
    onError: (error: any) => {},
  });
};

export const useUpdatePrivacy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePrivacyPayload) =>
      userService.updatePrivacy(payload),

    onSuccess: () => {
      // Refresh the settings cache so the UI reflects the new state
      queryClient.invalidateQueries({ queryKey: ["driver-settings"] });
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};
