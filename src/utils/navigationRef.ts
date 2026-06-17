import { createNavigationContainerRef } from "@react-navigation/native";

// Typed navigation ref
export const navigationRef = createNavigationContainerRef();

// Helper: safely get current route name
export function getCurrentRouteName() {
  return navigationRef.getCurrentRoute()?.name ?? null;
}

export function navigateAndReset(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
}
