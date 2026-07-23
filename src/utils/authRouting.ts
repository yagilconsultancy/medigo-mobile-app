import { UserProfileResponse } from "../types/user.types";

export const isDriverProfile = (profile?: UserProfileResponse | null) =>
  profile?.data?.role?.toLowerCase() === "driver";

export const driverNeedsOnboarding = (
  profile?: UserProfileResponse | null,
) => isDriverProfile(profile) && profile?.data?.onboarding_completed !== true;

export const getPostAuthRoute = (profile: UserProfileResponse) => {
  if (driverNeedsOnboarding(profile)) {
    return "DriverRegistrationFlow";
  }

  return isDriverProfile(profile) ? "DriverMainTabs" : "RiderMainTabs";
};
