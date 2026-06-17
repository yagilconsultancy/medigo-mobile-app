import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UpcomingRidesScreen from "../screens/Driver/Ride/upcomingRides";

const Stack = createNativeStackNavigator();

const DriverRideStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="UpcomingRidesScreen"
        component={UpcomingRidesScreen}
      />
    </Stack.Navigator>
  );
};

export default DriverRideStack;
