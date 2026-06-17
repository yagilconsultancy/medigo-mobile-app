import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyRidesScreen from "../screens/Rider/Ride/myRides";
import RideHistoryScreen from "../screens/Rider/Ride/history";

const Stack = createNativeStackNavigator();

const RiderHistoryStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="RideHistoryScreen" component={RideHistoryScreen} />
    </Stack.Navigator>
  );
};

export default RiderHistoryStack;
