import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DriverProfileScreen from "../screens/Driver/Profile/profile";

const Stack = createNativeStackNavigator();

const DriverProfileStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="DriverProfileScreen"
        component={DriverProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default DriverProfileStack;
