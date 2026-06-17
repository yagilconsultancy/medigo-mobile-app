import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DriverDashboard from "../screens/Driver/Main/home";

const Stack = createNativeStackNavigator();

const DriverMainStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
    </Stack.Navigator>
  );
};

export default DriverMainStack;
