import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RideDetails from "../screens/Driver/Ride/rideDetails";
import CompletedRide from "../screens/Driver/Ride/completedRide";
import TripInProgress from "../screens/Rider/Ride/tripInProgress";


const Stack = createNativeStackNavigator();

const DriverRideDetailsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="RideDetails" component={RideDetails} />
      <Stack.Screen name="TripInProgress" component={TripInProgress} />
      <Stack.Screen name="CompletedRide" component={CompletedRide} />      
    </Stack.Navigator>
  );
};

export default DriverRideDetailsStack;
