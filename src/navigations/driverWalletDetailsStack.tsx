import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WithdrawEarnings from "../screens/Driver/wallet/withdrawEarnings";

const Stack = createNativeStackNavigator();

const DriverWalletDetailsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="WithdrawEarnings" component={WithdrawEarnings} />
    </Stack.Navigator>
  );
};

export default DriverWalletDetailsStack;
