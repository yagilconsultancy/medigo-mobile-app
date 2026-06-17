import { AxiosResponse } from "axios";
import apiClient from "../client";
import {
  UpdateProfilePayload,
  UserProfileResponse,
} from "../../types/auth.types";
import {
  ConsentResponse,
  CreateEmergencyContactRequest,
  CreateLocationPayload,
  CreateLocationResponse,
  DocumentListResponse,
  DriverProfileResponse,
  DriverStatusResponse,
  EmergencyContactsResponse,
  SavedLocationsResponse,
  SettingsResponse,
  UpdateConsentPayload,
  UpdateDriverPayload,
  UpdateLocationRequest,
  UpdateNotificationsPayload,
  UpdatePrivacyPayload,
  UpdateStatusPayload,
  UpdateVehiclePayload,
  VehicleResponse,
} from "../../types/user.types";

const userService = {
  userProfile: async (): Promise<UserProfileResponse> => {
    const response: AxiosResponse<UserProfileResponse> =
      await apiClient.get("/users/me");
    return response.data;
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<UserProfileResponse> => {
    const response: AxiosResponse<UserProfileResponse> = await apiClient.patch(
      "/users/me",
      payload,
    );
    return response.data;
  },

  getEmergencyContacts: async (): Promise<EmergencyContactsResponse> => {
    const response: AxiosResponse<EmergencyContactsResponse> =
      await apiClient.get("/users/me/emergency-contacts");
    return response.data;
  },

  updateConsent: async (
    payload: UpdateConsentPayload,
  ): Promise<ConsentResponse> => {
    const response: AxiosResponse<ConsentResponse> = await apiClient.put(
      "/users/me/consent",
      payload,
    );
    return response.data;
  },

  getSavedLocations: async (): Promise<SavedLocationsResponse> => {
    const response: AxiosResponse<SavedLocationsResponse> = await apiClient.get(
      "/users/me/saved-locations",
    );
    return response.data;
  },

  createSavedLocation: async (
    payload: CreateLocationPayload,
  ): Promise<CreateLocationResponse> => {
    const response: AxiosResponse<CreateLocationResponse> =
      await apiClient.post("/users/me/saved-locations", payload);
    return response.data;
  },

  updateSavedLocation: async (
    locationId: string,
    data: UpdateLocationRequest,
  ) => {
    const response = await apiClient.put(
      `/users/me/saved-locations/${locationId}`,
      data,
    );
    return response.data;
  },

  getSavedLocationById: async (
    locationId: string,
  ): Promise<CreateLocationResponse> => {
    const response: AxiosResponse<CreateLocationResponse> = await apiClient.get(
      `/users/me/saved-locations/${locationId}`,
    );
    return response.data;
  },

  deleteSavedLocation: async (locationId: string) => {
    const response = await apiClient.delete(
      `/users/me/saved-locations/${locationId}`,
    );
    return response.data;
  },

  createEmergencyContact: async (data: CreateEmergencyContactRequest) => {
    const response = await apiClient.post("/users/me/emergency-contacts", data);
    return response.data;
  },

  deleteEmergencyContact: async (contactId: string) => {
    const response = await apiClient.delete(
      `/users/me/emergency-contacts/${contactId}`,
    );
    return response.data;
  },

  toggleOnlineStatus: async (
    payload: UpdateStatusPayload,
  ): Promise<DriverStatusResponse> => {
    const response = await apiClient.put("/users/drivers/me/status", payload);
    return response.data;
  },

  getDriverProfile: async (): Promise<DriverProfileResponse> => {
    const response = await apiClient.get("/users/drivers/me");
    return response.data;
  },

  updateDriverProfile: async (
    payload: UpdateDriverPayload,
  ): Promise<DriverProfileResponse> => {
    const response = await apiClient.put("/users/drivers/me", payload);
    return response.data;
  },

  getVehicleDetails: async (): Promise<VehicleResponse> => {
    const response = await apiClient.get("/users/drivers/me/vehicle");
    return response.data;
  },

  updateVehicleDetails: async (
    payload: UpdateVehiclePayload,
  ): Promise<VehicleResponse> => {
    const response = await apiClient.put("/users/drivers/me/vehicle", payload);
    return response.data;
  },

  getDocuments: async (): Promise<DocumentListResponse> => {
    const response = await apiClient.get("/users/me/documents");
    return response.data;
  },

  getSettings: async (): Promise<SettingsResponse> => {
    const response = await apiClient.get("/users/me/settings");
    return response.data;
  },

  updateNotifications: async (
    payload: UpdateNotificationsPayload,
  ): Promise<SettingsResponse> => {
    const response = await apiClient.put(
      "/users/me/settings/notifications",
      payload,
    );
    return response.data;
  },

  updatePrivacy: async (
    payload: UpdatePrivacyPayload,
  ): Promise<SettingsResponse> => {
    const response = await apiClient.put("/users/me/settings/privacy", payload);
    return response.data;
  },
};

export default userService;
