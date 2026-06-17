import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyTripsScreen from "../screens/Driver/Ride/myTrips";

const Stack = createNativeStackNavigator();

const DriverTripsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="MyTripsScreen" component={MyTripsScreen} />
    </Stack.Navigator>
  );
};

export default DriverTripsStack;
