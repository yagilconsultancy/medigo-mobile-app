import * as Application from "expo-application";
import * as Device from "expo-device";
import { Platform } from "react-native";

export const getDeviceId = async (): Promise<string> => {
  if (Platform.OS === "android") {
    return Application.getAndroidId() ?? "unknown-android";
  }

  if (Platform.OS === "ios") {
    return Device.osInternalBuildId ?? "unknown-ios";
  }

  return "unknown-device";
};
