import { NavigationState, PartialState, Route } from "@react-navigation/native";

type NavState = NavigationState | PartialState<NavigationState>;

export const getActiveRouteName = (
  navigationState: NavState | undefined
): string | null => {
  if (!navigationState) return null;

  // Use the index if it exists, otherwise default to 0
  const index = navigationState.index ?? 0;

  const route = navigationState.routes[index] as Route<string> & {
    state?: NavState;
  };

  if (route.state) {
    return getActiveRouteName(route.state);
  }

  return route.name;
};
