import { AxiosResponse } from "axios";
import apiClient from "../client";
import {
  ActiveRideResponse,
  CancelRidePayload,
  CreateRideRequest,
  RideDetailResponse,
  RidesQueryParams,
  RidesResponse,
  ShareRideResponse,
  TimelineResponse,
  UpcomingRidesResponse,
  UpdateRideStatusPayload,
  UpdateRideStatusResponse,
  UpdateStatusPayload,
} from "../../types/rides.types";

const rideService = {
  getRiderRides: async (params: RidesQueryParams): Promise<RidesResponse> => {
    const response: AxiosResponse<RidesResponse> = await apiClient.get(
      "/rides/rider/me",
      { params },
    );
    return response.data;
  },

  createRide: async (payload: any): Promise<any> => {
    const response: AxiosResponse<any> = await apiClient.post(
      "/rides/",
      payload,
    );
    return response.data;
  },

  getUpcomingRides: async (
    page = 1,
    limit = 20,
  ): Promise<UpcomingRidesResponse> => {
    const response = await apiClient.get("/rides/driver/upcoming", {
      params: { page, limit },
    });
    return response.data;
  },

  getRideDetail: async (rideId: string): Promise<RideDetailResponse> => {
    const response = await apiClient.get(`/rides/${rideId}`);
    return response.data;
  },

  getRideTimeline: async (rideId: string): Promise<TimelineResponse> => {
    const response = await apiClient.get(`/rides/${rideId}/timeline`);
    return response.data;
  },

  getActiveRide: async (): Promise<ActiveRideResponse> => {
    const response = await apiClient.get(`/rides/rider/me/active`);
    return response.data;
  },

  cancelRide: async (
    rideId: string,
    payload: CancelRidePayload,
  ): Promise<RideDetailResponse> => {
    const response = await apiClient.put(`/rides/${rideId}/cancel`, payload);
    return response.data;
  },

  shareRideLink: async (rideId: string): Promise<ShareRideResponse> => {
    const response = await apiClient.post(`/rides/${rideId}/share`, {});
    return response.data;
  },

  updateRideStatus: async (
    rideId: string,
    payload: UpdateRideStatusPayload,
  ): Promise<UpdateRideStatusResponse> => {
    const response = await apiClient.put(`/rides/${rideId}/status`, payload);
    return response.data;
  },
};

export default rideService;
