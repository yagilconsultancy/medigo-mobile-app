import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DriverEarningsDashboard from "../screens/Driver/wallet/myEarnings";

const Stack = createNativeStackNavigator();

const DriverWalletStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="DriverEarningsDashboard"
        component={DriverEarningsDashboard}
      />
    </Stack.Navigator>
  );
};

export default DriverWalletStack;
