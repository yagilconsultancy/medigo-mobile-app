import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DriverRatings from "../screens/Driver/wallet/myRatings";

const Stack = createNativeStackNavigator();

const DriverWalletStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="DriverRatings" component={DriverRatings} />
    </Stack.Navigator>
  );
};

export default DriverWalletStack;
