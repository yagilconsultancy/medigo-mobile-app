import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RideDetails from "../screens/Rider/Ride/rideDetails";
import BookARide from "../screens/Rider/Ride/bookARide";
import RideStatusScreen from "../screens/Rider/Ride/rideStatus";
import TripInProgress from "../screens/Rider/Ride/tripInProgress";

const Stack = createNativeStackNavigator();

const RiderRideDetailsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="RideDetails" component={RideDetails} />
      <Stack.Screen name="BookARide" component={BookARide} />
      <Stack.Screen name="RideStatus" component={RideStatusScreen} />
      <Stack.Screen name="TripInProgress" component={TripInProgress} />
    </Stack.Navigator>
  );
};

export default RiderRideDetailsStack;
