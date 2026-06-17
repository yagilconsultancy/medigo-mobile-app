import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RiderHomeScreen from "../screens/Rider/Main/home";


const Stack = createNativeStackNavigator();

const RiderMainStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="RiderHomeScreen" component={RiderHomeScreen} />
    </Stack.Navigator>
  );
};

export default RiderMainStack;
